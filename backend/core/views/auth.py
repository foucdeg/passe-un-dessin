import json
import logging

from django.http import HttpResponseBadRequest, HttpResponseForbidden, JsonResponse
from django.views.decorators.http import require_GET, require_POST
from rest_framework.generics import UpdateAPIView

from core.decorators import requires_player
from core.models import Player
from core.serializers import PlayerSerializer
from core.service.auth_service import SocialAuthInvalidTokenException, verify_user

logger = logging.getLogger("auth")


@require_GET
@requires_player
def get_me(request, player):
    return JsonResponse(PlayerSerializer(player).data)


class PlayerEditAPIView(UpdateAPIView):
    lookup_field = "uuid"
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer


@require_POST
def social_login(request):
    json_body = json.loads(request.body)

    try:
        auth_token = json_body["token"]
        provider = json_body["provider"]
    except KeyError:
        return HttpResponseBadRequest("Missing args")

    try:
        email = verify_user(auth_token=auth_token, provider=provider)
    except SocialAuthInvalidTokenException as e:
        logger.warning("Invalid social auth token provided", exc_info=e)

        return HttpResponseForbidden()

    return JsonResponse({"email": email})
