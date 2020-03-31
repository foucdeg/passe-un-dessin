
import json

from django.db import transaction
from django.http import HttpResponseBadRequest, JsonResponse
from django_eventstream import send_event
from rest_framework.generics import RetrieveAPIView

from core.messages import RoundStartsMessage
from core.models import Game, Pad, PadStep
from core.serializers import GameSerializer, PadSerializer, PadStepSerializer
from core.service.game_service import all_pads_initialized


class GameRetrieveAPIView(RetrieveAPIView):
    lookup_field = "uuid"
    queryset = Game.objects.prefetch_related(
        'players', 'pads', 'pads__initial_player', 'pads__steps', 'pads__steps__player'
    ).all()
    serializer_class = GameSerializer


class PadRetrieveAPIView(RetrieveAPIView):
    lookup_field = "uuid"
    queryset = Pad.objects.prefetch_related('initial_player', 'steps', 'steps__player').all()
    serializer_class = PadSerializer


class PadStepRetrieveAPIView(RetrieveAPIView):
    lookup_field = "uuid"
    queryset = PadStep.objects.prefetch_related('player').all()
    serializer_class = PadStepSerializer


def save_pad(request, uuid):
    if request.method != "PUT":
        return HttpResponseBadRequest("PUT expected")

    json_body = json.loads(request.body)

    try:
        sentence = json_body["sentence"]
        pad = Pad.objects.get(uuid=uuid)
        pad.sentence = sentence

        with transaction.atomic():
            pad.save()
            game = pad.game

            if all_pads_initialized(pad.game):
                send_event(
                    "game-%s" % game.uuid.hex, "message", RoundStartsMessage(game, 0).serialize(),
                )

            return JsonResponse(PadSerializer(pad).data)
    except Pad.DoesNotExist:
        return HttpResponseBadRequest("Pad with uuid %s does not exist" % uuid)
    except KeyError:
        return HttpResponseBadRequest("Provide player name!")
