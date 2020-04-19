from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from rest_framework.generics import UpdateAPIView

from core.models import Player
from core.serializers import PlayerSerializer


def get_me(request):
    if request.method != "GET":
        return HttpResponseBadRequest("GET expected")

    try:
        player_id = request.session["player_id"]
        player = Player.objects.get(uuid=player_id)

        return JsonResponse(PlayerSerializer(player).data)

    except (KeyError, Player.DoesNotExist):
        return HttpResponse(status=401)


class PlayerEditAPIView(UpdateAPIView):
    lookup_field = "uuid"
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
