import json
import logging

from django.db import transaction
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.views import View
from django_eventstream import send_event
from rest_framework.generics import RetrieveAPIView

from core.messages import PlayerConnectedMessage
from core.models import Player, Room
from core.serializers import (
    PlayerConnectedMessageSerializer,
    PlayerSerializer,
    RoomSerializer,
)
from core.service.game_service import initialize_game

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
            print(request.session["player_id"])
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
            message = PlayerConnectedMessage(player)
            logger.debug(
                "Sending message for player %s joining room %s"
                % (player.name, room.uuid.hex[:8])
            )
            send_event(
                "room-%s" % room.uuid.hex,
                "message",
                PlayerConnectedMessageSerializer(message).data,
            )
    except Room.DoesNotExist:
        return HttpResponseBadRequest("Room does not exist")

    return HttpResponse(status=200)


def start_game(request, room_id):
    if request.method != "PUT":
        return HttpResponseBadRequest("PUT expected")

    try:
        room = Room.objects.get(uuid=room_id)
        game = initialize_game(room)
        room.current_game = game
        room.save()

        return JsonResponse({"game_id": game.uuid.hex})
    except Room.DoesNotExist:
        return HttpResponseBadRequest("Room does not exist")
