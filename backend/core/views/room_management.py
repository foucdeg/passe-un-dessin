import json
import logging

from django.db import transaction
from django.db.models import Count
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.views import View
from django.views.decorators.http import require_GET, require_http_methods
from django_eventstream import send_event
from django.utils.translation import get_language_from_request
from rest_framework.generics import RetrieveAPIView

from core.decorators import requires_player
from core.messages import GameStartsMessage, PlayerConnectedMessage
from core.models import Game, GamePhase, Player, Room
from core.serializers import PlayerSerializer, RoomSerializer
from core.service.game_service import initialize_game
from core.service.room_service import remove_player_from_room
from core.service.suggestions import SuggestionEngine

logger = logging.getLogger(__name__)


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
    def _generate_friendly_name(self, request):
        """
        Generates a human friendly name for a room, does not enforce uniqueness
        """
        engine = SuggestionEngine()

        language = get_language_from_request(request)
        language = language[:2].lower()
        if language not in engine.get_supported_languages():
            language = "en"  # defaults to en

        suggestion = " ".join(engine.get_single_word_random(language, 3))
        suggestion = suggestion[:127]

        return suggestion

    def post(self, request):

        try:
            player_id = request.session["player_id"]
            player = Player.objects.get(uuid=player_id)
        except (KeyError, Player.DoesNotExist):
            return HttpResponseBadRequest("No player ID in session, or invalid")

        friendly_name = self._generate_friendly_name(request)
        room = Room.objects.create(admin=player, friendly_name=friendly_name)
        player.room = room
        player.save()

        return JsonResponse(RoomSerializer(room).data)


class RoomRetrieveAPIView(RetrieveAPIView):
    lookup_field = "uuid"
    queryset = Room.objects.prefetch_related("players").all()
    serializer_class = RoomSerializer


@require_http_methods(["PUT"])
@requires_player
def join_room(request, player, room_id):
    try:
        room = Room.objects.get(uuid=room_id)
        if room == player.room:
            return HttpResponse(status=200)

        with transaction.atomic():
            player.room = room
            player.save()
            logger.debug(
                "Sending message for player %s joining room %s"
                % (player.name, room.uuid.hex[:8])
            )
            send_event(
                "room-%s" % room.uuid.hex,
                "message",
                PlayerConnectedMessage(player).serialize(),
            )
    except Room.DoesNotExist:
        return HttpResponseBadRequest("Room does not exist")

    return HttpResponse(status=200)


@require_http_methods(["PUT"])
@requires_player
def leave_room(request, player, room_id):
    return remove_player_from_room(room_id, player.uuid.hex)


@require_http_methods(["PUT"])
def kick_player(request, room_id):
    try:
        json_body = json.loads(request.body)
        player_id = json_body["playerId"]

    except KeyError:
        return HttpResponseBadRequest("No player ID provided")

    return remove_player_from_room(room_id, player_id)


@require_http_methods(["PUT"])
def start_game(request, room_id):
    json_body = json.loads(request.body)
    players_order = json_body.get("playersOrder", None)
    round_duration = json_body.get("roundDuration")
    draw_own_word = json_body.get("drawOwnWord")

    try:
        room = Room.objects.get(uuid=room_id)

        for game in Game.objects.filter(room_id=room_id).exclude(
            phase=GamePhase.VOTE_RESULTS.value
        ):
            game.phase = GamePhase.VOTE_RESULTS.value
            game.save()

        game = initialize_game(room, players_order, round_duration, draw_own_word)
        room.current_game = game
        room.save()

        send_event(
            "room-%s" % room.uuid.hex, "message", GameStartsMessage(game).serialize(),
        )

        return JsonResponse({"game_id": game.uuid.hex})
    except Room.DoesNotExist:
        return HttpResponseBadRequest("Room does not exist")


@require_GET
def get_ranking(request, room_id):
    try:
        Room.objects.get(uuid=room_id)
    except Room.DoesNotExist:
        return HttpResponseBadRequest("Room does not exist")

    ranking = (
        Player.objects.values("uuid", "name", "color")
        .filter(
            steps__pad__game__room_id=room_id,
            steps__pad__game__phase=GamePhase.VOTE_RESULTS.value,
        )
        .annotate(count=Count("steps__votes"))
        .order_by("-count")
    )

    ranking_json = [
        {
            "player": PlayerSerializer(
                Player(uuid=rank["uuid"], color=rank["color"], name=rank["name"])
            ).data,
            "vote_count": rank["count"],
        }
        for rank in ranking
    ]

    return JsonResponse({"ranking": ranking_json})
