import json
import logging

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.db.models import Prefetch
from django.http import (
    HttpResponse,
    HttpResponseBadRequest,
    HttpResponseForbidden,
    JsonResponse,
)
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_GET, require_POST
from django_rest_passwordreset.models import ResetPasswordToken
from django_rest_passwordreset.views import ResetPasswordValidateToken
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.response import Response

from core.decorators import check_player_color, check_player_id
from core.models import Game, GamePhase, Player, PlayerGameParticipation, User
from core.serializers import (
    PlayerSerializer,
    PlayerWithHistorySerializer,
    PlayerWithUserSerializer,
    UserSerializer,
)
from core.service.auth_service import (
    SocialAuthInvalidTokenException,
    do_user_player_coherence,
    get_player_rank,
    save_avatar,
    verify_user,
)

logger = logging.getLogger(__name__)


@require_GET
def get_me(request):
    try:
        player_id = request.session["player_id"]
        player = Player.objects.get(uuid=player_id)

        if request.GET.get("withRank") == "true":
            player.rank = get_player_rank(player)

    except (KeyError, Player.DoesNotExist):
        return JsonResponse(None, safe=False)

    if request.user.is_authenticated:
        return JsonResponse(PlayerWithUserSerializer(player).data)

    return JsonResponse(PlayerSerializer(player).data)


class PlayerAPIView(RetrieveUpdateAPIView):
    lookup_field = "uuid"
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

    def retrieve(self, request, uuid):
        player = (
            self.get_queryset()
            .prefetch_related(
                Prefetch(
                    "participations",
                    queryset=PlayerGameParticipation.objects.order_by("-created_at"),
                ),
                Prefetch(
                    "participations__game",
                    queryset=Game.objects.exclude(phase=GamePhase.INIT.value).exclude(
                        phase=GamePhase.ROUNDS.value, current_round=0
                    ),
                ),
                "participations__game",
                "participations__game__participants",
                "participations__game__participants__player",
            )
            .get(uuid=uuid)
        )
        if request.GET.get("withRank") == "true":
            player.rank = get_player_rank(player)
        serializer = PlayerWithHistorySerializer(player)
        return JsonResponse(serializer.data)

    @check_player_id
    @check_player_color
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        avatar = request.data.get("avatar")
        if avatar:
            instance.avatar_url = save_avatar(instance, avatar)

        self.perform_update(serializer)

        return Response(serializer.data)

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


class ResetPasswordTokenDetails(ResetPasswordValidateToken):
    """
    Verify that a token is valid and return its details.
    """

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        print()
        token = get_object_or_404(ResetPasswordToken, key=serializer.data.get("token"))
        return Response({"status": "OK", "email": token.user.email})
