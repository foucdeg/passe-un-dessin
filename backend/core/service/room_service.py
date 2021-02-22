import logging

from django.db import transaction
from django.http import HttpResponse, HttpResponseBadRequest
from django_eventstream import send_event

from core.messages import (
    GameStartsMessage,
    NewAdminMessage,
    PlayerConnectedMessage,
    PlayerLeftMessage,
)
from core.models import GamePhase, PadStep, Player, Room
from core.service.game_service import initialize_game

logger = logging.getLogger(__name__)


def join_room(room: Room, player: Player):
    with transaction.atomic():
        if room == player.room:
            return
        player.room = room
        player.save()
        logger.debug(
            "Sending message for player %s joining room %s"
            % (player.name, room.uuid.hex[:8])
        )
        send_event(
            "room-%s" % room.uuid.hex,
            "message",
            PlayerConnectedMessage(player).serialize(),
        )


def remove_player_from_room(room_id: str, player_id: str):
    try:
        player = Player.objects.get(uuid=player_id)
    except Player.DoesNotExist:
        return HttpResponseBadRequest("No player by ID %s" % player_id)

    try:
        room = Room.objects.get(uuid=room_id)
    except Room.DoesNotExist:
        return HttpResponseBadRequest("Room %s does not exist" % room_id)

    if room != player.room:
        logger.warning(
            "remove_player_from_room: Player %s was not in room %s"
            % (player_id, room_id)
        )
        return HttpResponse(status=200)

    initial_room_number_of_players = room.players.count()

    with transaction.atomic():
        player.room = None
        player.save()

        needs_new_admin = room.admin == player
        logger.debug(
            "Sending message for player %s leaving room %s"
            % (player.name, room.uuid.hex[:8])
        )
        send_event(
            "room-%s" % room.uuid.hex,
            "message",
            PlayerLeftMessage(player, needs_new_admin).serialize(),
        )

        # Handle possible new admin
        if needs_new_admin:
            new_admin = room.players.all().first()

            if new_admin is not None:
                room.admin = new_admin
                room.save()

                logger.debug(
                    "Player %s left room %s, choosing new admin %s"
                    % (player.name, room.uuid.hex[:8], new_admin.name)
                )
                send_event(
                    "room-%s" % room.uuid.hex,
                    "message",
                    NewAdminMessage(new_admin).serialize(),
                )

        # If at first round, restart game while reusing preexisting initial sentences
        if (
            room.current_game is not None
            and room.current_game.phase == GamePhase.ROUNDS.value
            and room.current_game.current_round == 0
            and initial_room_number_of_players > 2
        ):
            # Create new game with same params
            new_game = initialize_game(
                room,
                [player.uuid.hex for player in room.players.all()],
                room.current_game.round_duration,
                room.current_game.draw_own_word,
                room.current_game.controlled_reveal,
            )

            # Apply any existing sentences on pads to new pad
            existing_sentences = PadStep.objects.filter(
                pad__game=room.current_game, round_number=0, sentence__isnull=False
            ).values_list("player", "sentence")

            for player, existing_sentence in existing_sentences:
                PadStep.objects.filter(
                    pad__game=new_game, round_number=0, player=player
                ).update(sentence=existing_sentence)

            # Switch to new game
            room.current_game = new_game
            room.save()

            send_event(
                "room-%s" % room.uuid.hex,
                "message",
                GameStartsMessage(new_game).serialize(),
            )

    return HttpResponse(status=200)
