import json

from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.views import View

from core.models import Player, Room
from core.serializers.player import PlayerSerializer, RoomSerializer


class PlayerView(View):
    def post(self, request):
        json_body = json.loads(request.body)

        try:
            name = json_body["name"]
        except KeyError:
            return HttpResponseBadRequest("Provide player name!")

        try:
            player_id = request.session["player_id"]
            player = Player.objects.get(player_id)

        except (KeyError, Player.DoesNotExist):
            player = Player.objects.create(name=name)

        player.save()

        return JsonResponse(PlayerSerializer(player).data)


class RoomCreationView(View):
    def post(self, request):

        try:
            player_id = request.session["player_id"]
            player = Player.objects.get(player_id)
        except (KeyError, Player.DoesNotExist):
            return HttpResponseBadRequest("No player ID in session, or invalid")

        room = Room.objects.create(admin=player)

        return JsonResponse(RoomSerializer(room).data)


def join_room(request, room_id):
    if request.method == "PUT":
        try:
            player_id = request.session["player_id"]
            player = Player.objects.get(player_id)
        except (KeyError, Player.DoesNotExist):
            return HttpResponseBadRequest("No player ID in session, or invalid")

        room = Room.objects.get_or_404(room_id)
        player.room = room
        player.save()

        return HttpResponse(status=200)
