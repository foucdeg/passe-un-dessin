import json
import logging

from django.db import transaction
from django.db.models import Count, Prefetch
from django.http import (
    HttpResponse,
    HttpResponseBadRequest,
    HttpResponseForbidden,
    JsonResponse,
)
from django.views.decorators.http import require_GET, require_http_methods
from django_eventstream import send_event
from rest_framework.generics import RetrieveAPIView

from core.decorators import requires_player
from core.messages import (
    PlayerFinishedMessage,
    PlayerNotFinishedMessage,
    PlayerViewingPadMessage,
)
from core.models import Game, GamePhase, Pad, PadStep, PlayerGameParticipation, Vote
from core.serializers import GameSerializer, PadSerializer, PadStepSerializer
from core.service.game_service import (
    GameRoundAssertionException,
    GameStateException,
    assert_phase,
    assert_round,
    get_available_vote_count,
    get_round_count,
    save_drawing_step,
    save_sentence_step,
    start_debrief,
    start_next_round,
    start_reveal,
    switch_to_vote_results,
)

logger = logging.getLogger(__name__)


class GameRetrieveAPIView(RetrieveAPIView):
    lookup_field = "uuid"
    queryset = Game.objects.prefetch_related(
        Prefetch(
            "participants",
            queryset=PlayerGameParticipation.objects.select_related(
                "player"
            ).order_by("order"),
        ),
        "pads",
        Prefetch("pads__steps", queryset=PadStep.objects.select_related("player")),
        "pads__steps__votes",
    ).all()
    serializer_class = GameSerializer


class PadRetrieveAPIView(RetrieveAPIView):
    lookup_field = "uuid"
    queryset = Pad.objects.prefetch_related("steps", "steps__player").all()
    serializer_class = PadSerializer


class PadStepRetrieveAPIView(RetrieveAPIView):
    lookup_field = "uuid"
    queryset = (
        PadStep.objects.prefetch_related("player")
        .prefetch_related("votes")
        .prefetch_related("votes__player")
        .all()
    )
    serializer_class = PadStepSerializer


@require_http_methods(["PUT"])
@requires_player
def submit_step(request, player, uuid):
    json_body = json.loads(request.body)

    try:
        step = PadStep.objects.get(uuid=uuid)
    except PadStep.DoesNotExist:
        return HttpResponseBadRequest("Pad step with uuid %s does not exist" % uuid)

    try:
        assert_round(step.pad.game, step.round_number)
    except GameRoundAssertionException as e:
        if step.pad.game.round_number == step.round_number + 1:
            logger.exception(e)
            return HttpResponse("Silently failing, the game has moved on", status=204)

    if "sentence" in json_body:
        save_sentence_step(step, json_body["sentence"])
    elif "drawing" in json_body:
        drawing = json_body["drawing"]
        if drawing is None or drawing == "":
            return HttpResponseBadRequest("Drawing should not be empty")

        if step.drawing is not None:
            return HttpResponseBadRequest(
                "Step with uuid %s already has a drawing" % uuid
            )
        save_drawing_step(step, drawing)
    else:
        return HttpResponseBadRequest("Provide either sentence or drawing!")

    data = PadStepSerializer(step).data
    return JsonResponse(data)


@require_http_methods(["PUT"])
@requires_player
def review_pad(request, player, uuid):
    try:
        pad = Pad.objects.get(uuid=uuid)
        game = pad.game
    except Pad.DoesNotExist:
        return HttpResponseBadRequest("Pad with uuid %s does not exist" % uuid)

    send_event(
        "game-%s" % game.uuid.hex,
        "message",
        PlayerViewingPadMessage(pad, player).serialize(),
    )
    return HttpResponse(status=204)


@require_http_methods(["POST", "DELETE"])
@requires_player
def submit_vote(request, player, pad_step_id):
    try:
        pad_step = PadStep.objects.get(uuid=pad_step_id)
    except PadStep.DoesNotExist:
        return HttpResponseBadRequest(
            "Pad step with uuid %s does not exist" % pad_step_id
        )

    game = pad_step.pad.game

    if not game.has_player(player) or game.phase != GamePhase.DEBRIEF.value:
        return HttpResponseBadRequest("You cannot vote for this game")

    if pad_step.player == player:
        return HttpResponseBadRequest("You cannot vote for your own drawing")

    existing_player_vote_count = Vote.objects.filter(
        player=player, pad_step__pad__game=game
    ).count()
    available_vote_count = get_available_vote_count(game)

    if request.method == "POST":
        if existing_player_vote_count >= available_vote_count:
            return HttpResponseBadRequest(
                "You already reached the maximal number of vote for this game : %s"
                % available_vote_count
            )

        Vote.objects.create(player=player, pad_step=pad_step)

        if existing_player_vote_count + 1 == available_vote_count:
            send_event(
                "game-%s" % game.uuid.hex,
                "message",
                PlayerFinishedMessage(player).serialize(),
            )

            with transaction.atomic():
                game = Game.objects.select_for_update().get(uuid=game.uuid)
                game.pads_done = game.pads_done + 1
                game.save()

            if game.pads_done == game.participants.count():
                switch_to_vote_results(game)

        return HttpResponse(status=201)

    elif request.method == "DELETE":
        vote = Vote.objects.filter(player=player, pad_step=pad_step).first()
        if vote is None:
            return HttpResponseBadRequest(
                "You didn't vote for pad_step %s" % pad_step_id
            )
        vote.delete()

        if existing_player_vote_count == available_vote_count:
            # Player was done but is not anymore
            send_event(
                "game-%s" % game.uuid.hex,
                "message",
                PlayerNotFinishedMessage(player).serialize(),
            )

            with transaction.atomic():
                game = Game.objects.select_for_update().get(uuid=game.uuid)
                game.pads_done = game.pads_done - 1
                game.save()

        return HttpResponse(status=204)


@require_GET
def get_vote_results(request, game_id):
    pad_steps = (
        PadStep.objects.filter(pad__game_id=game_id)
        .prefetch_related("player", "votes")
        .annotate(count=Count("votes"))
        .filter(count__gt=0)
        .order_by("-count")
    )

    data = PadStepSerializer(pad_steps, many=True).data

    return JsonResponse({"winners": data})


@require_GET
@requires_player
def player_should_join(request, player, game_id):
    try:
        game = Game.objects.get(uuid=game_id)
    except Game.DoesNotExist:
        return HttpResponseBadRequest("Game with uuid %s does not exist" % game_id)

    return JsonResponse({"is_in_game": game.has_player(player), "phase": game.phase})


@require_http_methods(["PUT"])
@requires_player
def force_state(request, player, game_id):
    try:
        game = Game.objects.get(uuid=game_id)

    except Game.DoesNotExist:
        return HttpResponseBadRequest("Game with uuid %s does not exist" % game_id)

    if game.room.admin != player:
        return HttpResponseForbidden("Player is not admin of game %s" % game_id)

    json_body = json.loads(request.body)
    try:
        next_phase = json_body["nextPhase"]
        next_round = json_body["nextRound"]
    except KeyError:
        return HttpResponseBadRequest("nextPhase or nextRound not found in payload")

    try:
        # Requested phase is a Round
        if next_phase == GamePhase.ROUNDS.value:
            assert_phase(game, GamePhase.ROUNDS)
            assert_round(game, next_round - 1)
            start_next_round(game, next_round)
            return HttpResponse(status=204)

        # Requested phase is Reveal - switching from last round
        if next_phase == GamePhase.REVEAL.value:
            if not game.controlled_reveal:
                raise ValueError()
            assert_phase(game, GamePhase.ROUNDS)
            game_round_count = get_round_count(game)
            assert_round(game, game_round_count)

            start_reveal(game)
            return HttpResponse(status=204)

        # Requested phase is Debrief - switching from last round or from Reveal
        if next_phase == GamePhase.DEBRIEF.value:
            if game.controlled_reveal:
                assert_phase(game, GamePhase.REVEAL)
            else:
                assert_phase(game, GamePhase.ROUNDS)
                game_round_count = get_round_count(game)
                assert_round(game, game_round_count)

            start_debrief(game)
            return HttpResponse(status=204)

        # Requested phase is Vote Results - switching from Debrief
        if next_phase == GamePhase.VOTE_RESULTS.value:
            assert_phase(game, GamePhase.DEBRIEF)
            switch_to_vote_results(game)
            return HttpResponse(status=204)

        # Requested phase was invalid
        return HttpResponseBadRequest("Invalid requested phase %s" % next_phase)
    except GameStateException as e:
        return HttpResponseBadRequest(
            "Unfufilled game state assertion when forcing game state: %s" % str(e)
        )
