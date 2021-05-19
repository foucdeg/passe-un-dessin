import logging
from enum import Enum
from random import randrange
from time import time

import requests
from django.conf import settings
from django.db import connection
from django.db.utils import IntegrityError
from django_eventstream import send_event
from google.auth.transport import requests as gauth_requests
from google.oauth2 import id_token

from core.messages import PlayerReplacedMessage
from core.models import PadStep, Player, PlayerGameParticipation, Room, User, Vote

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
                auth_token, gauth_requests.Request(), settings.AUTH_GOOGLE_CLIENT_ID
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
                reset_creation_dates(user.player)
                user.player.save()

    except (KeyError, Player.DoesNotExist):
        if user.player is None:
            player = Player.objects.create(name=generate_player_name())
            user.player = player
            user.save()

    request.session["player_id"] = user.player.uuid.__str__()


def merge_users(from_user: User, into_user: User):
    if from_user.player is not None:
        if into_user.player is not None:
            merge_players(from_player=from_user.player, into_player=into_user.player)
        else:
            into_user.player = from_user.player
            into_user.save()

    from_user.delete()


def merge_players(from_player: Player, into_player: Player):
    Room.objects.filter(admin=from_player).update(admin=into_player)
    for pgp in PlayerGameParticipation.objects.filter(player=from_player):
        try:
            pgp.player = into_player
            pgp.save()
        except IntegrityError:
            # already a PGP with this player
            pass
    PadStep.objects.filter(player=from_player).update(player=into_player)
    Vote.objects.filter(player=from_player).update(player=into_player)

    from_avatar = from_player.avatar_url
    into_avatar = into_player.avatar_url

    if from_player.room is not None:
        into_player.room = from_player.room
        into_player.total_score += from_player.total_score
        into_player.save()
        send_event(
            "room-%s" % from_player.room.uuid.hex,
            "message",
            PlayerReplacedMessage(from_player, into_player).serialize(),
        )
    from_player.delete()

    # Recompute total score
    into_player.total_score = Vote.objects.filter(
        pad_step__player=into_player
    ).count()

    # apply latest avatar
    if from_avatar and (
        not into_avatar or into_player.created_at <= from_player.created_at
    ):
        into_player.avatar_url = from_avatar

    into_player.save()


def reset_creation_dates(player: Player):
    first_participation = player.participations.order_by("game__created_at").first()
    if not first_participation:
        return
    first_game_created_at = first_participation.game.created_at
    if first_game_created_at < player.created_at:
        logger.info(
            "Updating player %s's creation date to %s"
            % (player.name, str(first_game_created_at))
        )
        player.created_at = first_game_created_at


def get_player_rank(player):
    with connection.cursor() as cursor:
        cursor.execute(
            """
                SELECT rank from (
                    SELECT
                        uuid,
                        RANK() OVER (ORDER BY total_score DESC) AS rank
                    FROM core_player
                    ORDER BY rank, uuid
                ) sub
                WHERE uuid = %s
                """,
            [player.uuid],
        )
        row = cursor.fetchone()
        return row[0]


def save_avatar(player, drawing):
    base_api = settings.DRAWING_RENDERER_HOST
    url = base_api + "drawings/avatar/" + str(player.uuid)

    r = requests.post(url, json={"drawing": drawing})
    r.raise_for_status()

    return r.json()["publicPath"]
