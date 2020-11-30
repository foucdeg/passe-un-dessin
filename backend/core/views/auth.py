import json
import logging

from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth.tokens import default_token_generator
from django.db import IntegrityError
from django.db.models import Count, Prefetch
from django.db.models.expressions import F, Window
from django.db.models.functions.window import Rank
from django.http import (
    HttpResponse,
    HttpResponseBadRequest,
    HttpResponseForbidden,
    HttpResponseNotFound,
    JsonResponse,
)
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET, require_POST
from rest_framework.generics import RetrieveUpdateAPIView

from core.decorators import check_player_color, check_player_id, requires_player
from core.models import Game, GamePhase, Player, PlayerGameParticipation, User, Vote
from core.serializers import (
    PlayerSerializer,
    PlayerWithAvatarSerializer,
    PlayerWithHistorySerializer,
    PlayerWithUserAndAvatarSerializer,
    UserSerializer,
)
from core.service.auth_service import (
    SocialAuthInvalidTokenException,
    do_user_player_coherence,
    verify_user,
)

logger = logging.getLogger(__name__)


@require_GET
@requires_player
def get_me(request, player):
    if request.user.is_authenticated:
        return JsonResponse(PlayerWithUserAndAvatarSerializer(player).data)

    return JsonResponse(PlayerWithAvatarSerializer(player).data)


class PlayerAPIView(RetrieveUpdateAPIView):
    lookup_field = "uuid"
    queryset = Player.objects.all()
    serializer_class = PlayerWithAvatarSerializer

    def retrieve(self, request, uuid):
        queryset = (
            self.get_queryset()
            .prefetch_related(
                Prefetch(
                    "participations",
                    queryset=PlayerGameParticipation.objects.order_by("-created_at"),
                ),
                Prefetch(
                    "participations__game",
                    queryset=Game.objects.exclude(phase=GamePhase.INIT.value),
                ),
                "participations__game",
                "participations__game__participants",
                "participations__game__participants__player",
            )
            .get(uuid=uuid)
        )
        serializer = PlayerWithHistorySerializer(queryset)
        return JsonResponse(serializer.data)

    @check_player_id
    @check_player_color
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @check_player_id
    @check_player_color
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)


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

    try:
        user = User.objects.get(email=email.lower())
        created = False
    except User.DoesNotExist:
        user = User.objects.create_user(email.lower())
        created = True

    # If there is already a player in the session, set it on the user
    do_user_player_coherence(request, user)

    login(request, user)

    resp = UserSerializer(user).data
    resp["_created"] = created
    return JsonResponse(resp)


@require_POST
def create_account(request):
    json_body = json.loads(request.body)

    try:
        email = json_body["email"]
        password = json_body["password"]
    except KeyError:
        return HttpResponseBadRequest("Missing email or password")

    try:
        user = User.objects.create_user(email.lower(), password)
        login(request, user)
        do_user_player_coherence(request, user)

        return JsonResponse(UserSerializer(user).data)
    except IntegrityError:
        return HttpResponseBadRequest("Email already in use")


@require_POST
def check_login(request):
    json_body = json.loads(request.body)

    try:
        email = json_body["email"]
        password = json_body["password"]
    except KeyError:
        return HttpResponseBadRequest("Missing email or password")

    user = authenticate(request, username=email.lower(), password=password)
    if user is not None:
        login(request, user)
        do_user_player_coherence(request, user)

        return JsonResponse(UserSerializer(user).data)
    else:
        return HttpResponseForbidden("Invalid email or password")


@require_POST
@login_required
def do_logout(request):
    logout(request)

    return HttpResponse("Logout successful")


@require_GET
def get_total_score(request, uuid):
    players = Player.objects.raw(
        """
        SELECT * from (
            SELECT
                *,
                RANK() OVER (ORDER BY total_score DESC) AS rank
            FROM core_player
            ORDER BY rank, uuid
        ) sub
        WHERE uuid = %s
    """,
        [uuid],
    )

    if len(players) == 0:
        return HttpResponseNotFound("Player not found")

    if len(players) > 2:
        return HttpResponseBadRequest(
            "Several players found : it should never happen"
        )

    player = players[0]
    return JsonResponse({"score": player.total_score, "ranking": player.rank})
