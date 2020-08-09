import logging
from enum import Enum
from random import randrange
from time import time

from django.conf import settings
from google.auth.transport import requests
from google.oauth2 import id_token

from core.models import (
    Pad,
    PadStep,
    Player,
    PlayerGameParticipation,
    Room,
    User,
    Vote,
)

from .facebook_client import get_user_email, verify_token

logger = logging.getLogger(__name__)


class SocialAuthProvider(Enum):
    GOOGLE = "GOOGLE"
    FACEBOOK = "FACEBOOK"


class SocialAuthInvalidTokenException(BaseException):
    pass


class GoogleAuthInvalidTokenException(SocialAuthInvalidTokenException):
    pass


class FacebookAuthInvalidTokenException(SocialAuthInvalidTokenException):
    pass


def generate_player_name():
    while True:
        player_name = "Player%d" % randrange(100000)
        try:
            Player.objects.get(name=player_name)
        except Player.DoesNotExist:
            return player_name


def verify_user(auth_token: str, provider: SocialAuthProvider):
    if provider == SocialAuthProvider.GOOGLE.value:
        try:
            idinfo = id_token.verify_oauth2_token(
                auth_token, requests.Request(), settings.AUTH_GOOGLE_CLIENT_ID
            )

            return idinfo["email"]
        except ValueError:
            raise GoogleAuthInvalidTokenException("Invalid Google token provided")

    if provider == SocialAuthProvider.FACEBOOK.value:
        token_data = verify_token(auth_token)
        if not token_data.get("is_valid"):
            raise FacebookAuthInvalidTokenException("Invalid token")
        if token_data.get("app_id") != settings.AUTH_FACEBOOK_APP_ID:
            raise FacebookAuthInvalidTokenException("Wrong app ID")
        if token_data.get("expires_at") < time():
            raise FacebookAuthInvalidTokenException("Token expired")
        if token_data.get("type") != "USER":
            raise FacebookAuthInvalidTokenException("Invalid token type")
        if "email" not in token_data.get("scopes"):
            raise FacebookAuthInvalidTokenException("Invalid scope")

        return get_user_email(auth_token)

    raise ValueError("Incorrect social auth provider")


def do_user_player_coherence(request, user: User):
    try:
        player_id = request.session["player_id"]
        player = Player.objects.get(uuid=player_id)

        if user.player is None:
            logger.info("Attributing player %s to user %s" % (player, user))
            user.player = player
            user.save()
        else:
            if user.player == player:
                pass
            else:
                logger.info(
                    "Merging player %s into user player %s" % (player, user.player)
                )
                merge_players(from_player=player, into_player=user.player)

    except (KeyError, Player.DoesNotExist):
        if user.player is None:
            player = Player.objects.create(name=generate_player_name())
            user.player = player
            user.save()

    request.session["player_id"] = user.player.uuid.__str__()


def merge_players(from_player: Player, into_player: Player):
    Room.objects.filter(admin=from_player).update(admin=into_player)
    PlayerGameParticipation.objects.filter(player=from_player).update(
        player=into_player
    )
    Pad.objects.filter(initial_player=from_player).update(initial_player=into_player)
    PadStep.objects.filter(player=from_player).update(player=into_player)
    Vote.objects.filter(player=from_player).update(player=into_player)
    from_player.delete()
