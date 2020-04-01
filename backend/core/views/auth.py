from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse

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
