import logging

from django.db import transaction
from django.http import HttpResponse, HttpResponseBadRequest
from django_eventstream import send_event

from core.messages import NewAdminMessage, PlayerLeftMessage
from core.models import Player, Room

logger = logging.getLogger(__name__)


def remove_player_from_room(room_id: str, player_id: str):
    try:
        player = Player.objects.get(uuid=player_id)
    except Player.DoesNotExist:
        return HttpResponseBadRequest("No player by ID %s" % player_id)

    try:
        room = Room.objects.get(uuid=room_id)
        if room != player.room:
            return HttpResponseBadRequest(
                "Player %s was not room %s" % (player_id, room_id)
            )
    except Room.DoesNotExist:
        return HttpResponseBadRequest("Room %s does not exist" % room_id)

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

    return HttpResponse(status=200)
