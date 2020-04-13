import json
import logging

from django.db import transaction
from django.http import HttpResponseBadRequest, JsonResponse
from django_eventstream import send_event
from rest_framework.generics import RetrieveAPIView

from core.messages import PlayerFinishedMessage
from core.models import Game, Pad, PadStep
from core.serializers import GameSerializer, PadSerializer, PadStepSerializer
from core.service.game_service import start_next_round, switch_to_rounds

logger = logging.getLogger(__name__)


class GameRetrieveAPIView(RetrieveAPIView):
    lookup_field = "uuid"
    queryset = Game.objects.prefetch_related(
        "players", "pads", "pads__initial_player", "pads__steps", "pads__steps__player"
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


def save_pad(request, uuid):
    if request.method != "PUT":
        return HttpResponseBadRequest("PUT expected")

    json_body = json.loads(request.body)

    try:
        sentence = json_body["sentence"]
    except KeyError:
        return HttpResponseBadRequest("Provide sentence!")

    try:
        pad = Pad.objects.get(uuid=uuid)
    except Pad.DoesNotExist:
        return HttpResponseBadRequest("Pad with uuid %s does not exist" % uuid)

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


def save_step(request, uuid):
    if request.method != "PUT":
        return HttpResponseBadRequest("PUT expected")

    json_body = json.loads(request.body)

    try:
        step = PadStep.objects.get(uuid=uuid)
    except PadStep.DoesNotExist:
        return HttpResponseBadRequest("Pad step with uuid %s does not exist" % uuid)

    try:
        sentence = json_body["sentence"]
        if sentence == '':
            return HttpResponseBadRequest("Sentence should not be empty")
        step.sentence = sentence
    except KeyError:
        try:
            drawing = json_body["drawing"]
            if drawing == '':
                return HttpResponseBadRequest("Drawing should not be empty")
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
