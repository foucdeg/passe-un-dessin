import json
import logging

from django.db import transaction
from django.db.models import Count
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.views.decorators.http import require_GET, require_http_methods
from django_eventstream import send_event
from rest_framework.generics import RetrieveAPIView

from core.decorators import requires_player
from core.messages import PlayerFinishedMessage, PlayerViewingPadMessage
from core.models import Game, GamePhase, Pad, PadStep, Vote
from core.serializers import GameSerializer, PadSerializer, PadStepSerializer
from core.service.game_service import (end_debrief, get_available_vote_count,
                                       send_all_vote_count, start_next_round,
                                       switch_to_rounds)

logger = logging.getLogger(__name__)


class GameRetrieveAPIView(RetrieveAPIView):
    lookup_field = "uuid"
    queryset = Game.objects.prefetch_related(
        "players",
        "pads",
        "pads__initial_player",
        "pads__steps",
        "pads__steps__player",
        "pads__steps__votes",
    ).all()
    serializer_class = GameSerializer


class PadRetrieveAPIView(RetrieveAPIView):
    lookup_field = "uuid"
    queryset = Pad.objects.prefetch_related(
        "initial_player", "steps", "steps__player"
    ).all()
    serializer_class = PadSerializer


class PadStepRetrieveAPIView(RetrieveAPIView):
    lookup_field = "uuid"
    queryset = PadStep.objects.prefetch_related("player").all()
    serializer_class = PadStepSerializer


@require_http_methods(["PUT"])
@requires_player
def save_pad(request, player, uuid):
    json_body = json.loads(request.body)

    try:
        sentence = json_body["sentence"]
    except KeyError:
        return HttpResponseBadRequest("Provide sentence!")

    try:
        pad = Pad.objects.get(uuid=uuid)
    except Pad.DoesNotExist:
        return HttpResponseBadRequest("Pad with uuid %s does not exist" % uuid)

    if sentence is None or sentence == "":
        return HttpResponseBadRequest("Invalid empty sentence")

    if pad.sentence is not None:
        return HttpResponseBadRequest("Pad with uuid %s already saved" % uuid)

    pad.sentence = sentence
    pad.save()

    game = pad.game

    send_event(
        "game-%s" % game.uuid.hex,
        "message",
        PlayerFinishedMessage(pad.initial_player).serialize(),
    )

    with transaction.atomic():
        game = Game.objects.select_for_update().get(uuid=game.uuid)
        game.pads_done = game.pads_done + 1
        game.save()

    if game.pads_done == game.players.count():
        logger.debug(
            "All pads have their initial sentence for game %s" % game.uuid.hex[:8]
        )
        switch_to_rounds(game)

    return JsonResponse(PadSerializer(pad).data)


@require_http_methods(["PUT"])
@requires_player
def save_step(request, player, uuid):
    json_body = json.loads(request.body)

    try:
        step = PadStep.objects.get(uuid=uuid)
    except PadStep.DoesNotExist:
        return HttpResponseBadRequest("Pad step with uuid %s does not exist" % uuid)

    try:
        sentence = json_body["sentence"]
        if sentence is None or sentence == "":
            return HttpResponseBadRequest("Sentence should not be empty")

        if step.sentence is not None:
            return HttpResponseBadRequest(
                "Step with uuid %s already has a sentence" % uuid
            )

        step.sentence = sentence
    except KeyError:
        try:
            drawing = json_body["drawing"]
            if drawing is None or drawing == "":
                return HttpResponseBadRequest("Drawing should not be empty")

            if step.drawing is not None:
                return HttpResponseBadRequest(
                    "Step with uuid %s already has a drawing" % uuid
                )

            step.drawing = drawing
        except KeyError:
            return HttpResponseBadRequest("Provide either sentence or drawing!")

    step.save()

    game = step.pad.game

    send_event(
        "game-%s" % game.uuid.hex,
        "message",
        PlayerFinishedMessage(step.player).serialize(),
    )

    with transaction.atomic():
        game = Game.objects.select_for_update().get(uuid=game.uuid)
        game.pads_done = game.pads_done + 1
        game.save()

    if game.pads_done == game.players.count():
        start_next_round(game, game.current_round + 1)

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
    return HttpResponse(status=201)


@require_http_methods(["POST", "DELETE"])
@requires_player
def toggle_vote(request, player, pad_step_id):
    try:
        pad_step = PadStep.objects.get(uuid=pad_step_id)
    except PadStep.DoesNotExist:
        return HttpResponseBadRequest(
            "Pad step with uuid %s does not exist" % pad_step_id
        )

    game = pad_step.pad.game

    if player not in game.players.all() or game.phase != GamePhase.DEBRIEF.value:
        return HttpResponseBadRequest("You cannot vote for this game")

    if pad_step.player == player:
        return HttpResponseBadRequest("You cannot vote for your own drawing")

    if request.method == "POST":
        try:
            Vote.objects.get(player=player, pad_step=pad_step)
            return HttpResponseBadRequest(
                "You already voted for pad_step %s" % pad_step_id
            )
        except Vote.DoesNotExist:
            existing_player_vote_count = Vote.objects.filter(
                player=player, pad_step__pad__game=game
            ).count()
            available_vote_count = get_available_vote_count(game)

            if existing_player_vote_count >= available_vote_count:
                return HttpResponseBadRequest(
                    "You already reached the maximal number of vote for this game : %s"
                    % available_vote_count
                )

            Vote.objects.create(player=player, pad_step=pad_step)

    elif request.method == "DELETE":
        try:
            vote = Vote.objects.get(player=player, pad_step=pad_step)
            vote.delete()
        except Vote.DoesNotExist:
            return HttpResponseBadRequest(
                "You didn't vote for pad_step %s" % pad_step_id
            )

    send_all_vote_count(game)

    pad_step = PadStep.objects.get(uuid=pad_step_id)
    data = PadStepSerializer(pad_step).data
    return JsonResponse(data)


@require_http_methods(["PUT"])
def go_to_vote_results(request, game_id):
    try:
        game = Game.objects.get(uuid=game_id)
    except Game.DoesNotExist:
        return HttpResponseBadRequest("Game with uuid %s does not exist" % game_id)

    end_debrief(game)

    return HttpResponse(status=200)


@require_GET
def get_vote_results(request, game_id):
    pad_steps = (
        PadStep.objects.filter(pad__game_id=game_id)
        .annotate(count=Count("votes"))
        .filter(count__gt=0)
        .order_by("-count")
    )

    data = PadStepSerializer(pad_steps, many=True).data

    return JsonResponse({"winners": data})


@require_GET
@requires_player
def is_player_in_game(request, player, game_id):
    try:
        game = Game.objects.get(uuid=game_id)
    except Game.DoesNotExist:
        return HttpResponseBadRequest("Game with uuid %s does not exist" % game_id)

    return JsonResponse({"is_in_game": player in game.players.all()})
