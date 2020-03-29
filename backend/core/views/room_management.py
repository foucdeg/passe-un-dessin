import json

from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.views import View

from core.models import Player, Room
from core.serializers import GameSerializer, PlayerSerializer, RoomSerializer
from core.service.game_service import initialize_game


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


def join_room(request, room_id):
    if request.method == "PUT":
        try:
            player_id = request.session["player_id"]
            player = Player.objects.get(uuid=player_id)
        except (KeyError, Player.DoesNotExist):
            return HttpResponseBadRequest("No player ID in session, or invalid")

        try:
            room = Room.objects.get(uuid=room_id)
            player.room = room
            player.save()
        except Room.DoesNotExist:
            return HttpResponseBadRequest("Room does not exist")

        return HttpResponse(status=200)

    return HttpResponseBadRequest("PUT expected")


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
