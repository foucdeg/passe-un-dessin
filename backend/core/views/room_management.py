import json
import logging

from core.messages import (
    GameStartsMessage,
    NewAdminMessage,
    PlayerConnectedMessage,
    PlayerLeftMessage,
)
from core.models import Game, GamePhase, Player, Room
from core.serializers import PlayerSerializer, RoomSerializer
from core.service.game_service import initialize_game
from django.db import transaction
from django.db.models import Count
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.views import View
from django_eventstream import send_event
from rest_framework.generics import RetrieveAPIView

logger = logging.getLogger(__name__)


class PlayerView(View):
    def post(self, request):
        json_body = json.loads(request.body)

        try:
            name = json_body["name"]
        except KeyError:
            return HttpResponseBadRequest("Provide player name!")

        try:
            player_id = request.session["player_id"]
            player = Player.objects.get(uuid=player_id)
            player.name = name
            player.save()

        except (KeyError, Player.DoesNotExist):
            player = Player.objects.create(name=name)

        request.session["player_id"] = player.uuid.__str__()

        return JsonResponse(PlayerSerializer(player).data)


class RoomCreationView(View):
    def post(self, request):

        try:
            player_id = request.session["player_id"]
            player = Player.objects.get(uuid=player_id)
        except (KeyError, Player.DoesNotExist):
            return HttpResponseBadRequest("No player ID in session, or invalid")

        room = Room.objects.create(admin=player)
        player.room = room
        player.save()

        return JsonResponse(RoomSerializer(room).data)


class RoomRetrieveAPIView(RetrieveAPIView):
    lookup_field = "uuid"
    queryset = Room.objects.prefetch_related("players").all()
    serializer_class = RoomSerializer


def join_room(request, room_id):
    if request.method != "PUT":
        return HttpResponseBadRequest("PUT expected")

    try:
        player_id = request.session["player_id"]
        player = Player.objects.get(uuid=player_id)
    except (KeyError, Player.DoesNotExist):
        return HttpResponseBadRequest("No player ID in session, or invalid")

    try:
        room = Room.objects.get(uuid=room_id)
        if room == player.room:
            return HttpResponse(status=200)

        with transaction.atomic():
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
    except Room.DoesNotExist:
        return HttpResponseBadRequest("Room does not exist")

    return HttpResponse(status=200)


def leave_room(request, room_id):
    if request.method != "PUT":
        return HttpResponseBadRequest("PUT expected")

    try:
        player_id = request.session["player_id"]
    except KeyError:
        return HttpResponseBadRequest("No player ID in session")

    return remove_player_from_room(room_id, player_id)


def kick_player(request, room_id):
    if request.method != "PUT":
        return HttpResponseBadRequest("PUT expected")

    try:
        json_body = json.loads(request.body)
        player_id = json_body["playerId"]

    except KeyError:
        return HttpResponseBadRequest("No player ID provided")

    return remove_player_from_room(room_id, player_id)


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
        logger.debug(
            "Sending message for player %s leaving room %s"
            % (player.name, room.uuid.hex[:8])
        )
        send_event(
            "room-%s" % room.uuid.hex, "message", PlayerLeftMessage(player).serialize(),
        )
        if room.admin == player:
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


def start_game(request, room_id):
    if request.method != "PUT":
        return HttpResponseBadRequest("PUT expected")

    json_body = json.loads(request.body)
    players_order = json_body.get("playersOrder", None)
    round_duration = json_body.get("roundDuration", None)

    try:
        room = Room.objects.get(uuid=room_id)

        for game in Game.objects.filter(room_id=room_id).exclude(
            phase=GamePhase.VOTE_RESULTS.value
        ):
            game.phase = GamePhase.VOTE_RESULTS.value
            game.save()

        game = initialize_game(room, players_order, round_duration)
        room.current_game = game
        room.save()

        send_event(
            "room-%s" % room.uuid.hex, "message", GameStartsMessage(game).serialize(),
        )

        return JsonResponse({"game_id": game.uuid.hex})
    except Room.DoesNotExist:
        return HttpResponseBadRequest("Room does not exist")


def get_ranking(request, room_id):
    if request.method != "GET":
        return HttpResponseBadRequest("PUT expected")

    try:
        Room.objects.get(uuid=room_id)
    except Room.DoesNotExist:
        return HttpResponseBadRequest("Room does not exist")

    ranking = (
        Player.objects.values("uuid", "name", "color")
        .filter(steps__pad__game__room_id=room_id)
        .annotate(count=Count("steps__votes"))
        .order_by("-count")
    )

    ranking_json = [
        {
            "player": PlayerSerializer(
                Player(uuid=rank["uuid"], color=rank["color"], name=rank["name"])
            ).data,
            "vote_count": rank["count"],
        }
        for rank in ranking
    ]

    return JsonResponse({"ranking": ranking_json})
