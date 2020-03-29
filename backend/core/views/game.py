
from rest_framework.generics import RetrieveAPIView

from core.models import Game, Pad, PadStep
from core.serializers import GameSerializer, PadSerializer, PadStepSerializer


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
