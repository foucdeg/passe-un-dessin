from django.http import JsonResponse
from django.views.decorators.http import require_GET
from rest_framework.generics import UpdateAPIView

from core.decorators import requires_player
from core.models import Player
from core.serializers import PlayerSerializer


@require_GET
@requires_player
def get_me(request, player):
    return JsonResponse(PlayerSerializer(player).data)


class PlayerEditAPIView(UpdateAPIView):
    lookup_field = "uuid"
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
