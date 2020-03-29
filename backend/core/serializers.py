from rest_framework import serializers

from core.models import Game, Pad, PadStep, Player, Room


class BaseSerializer(serializers.ModelSerializer):
    uuid = serializers.UUIDField(format="hex")


class PlayerSerializer(BaseSerializer):
    class Meta:
        model = Player
        fields = ("uuid", "name")


class RoomSerializer(BaseSerializer):
    class Meta:
        model = Room
        fields = ("uuid",)


class PadStepSerializer(BaseSerializer):
    player = PlayerSerializer()

    class Meta:
        model = PadStep
        fields = ("uuid", "step_type", "round_number", "player", "sentence", "drawing")


class PadSerializer(BaseSerializer):
    initial_player = PlayerSerializer()
    steps = PadStepSerializer(many=True)

    class Meta:
        model = Pad
        fields = ("uuid", "initial_player", "steps", "order")


class GameSerializer(BaseSerializer):
    players = PlayerSerializer(many=True)
    pads = PadSerializer(many=True)
    rounds = PadStepSerializer(many=True)

    class Meta:
        model = Game
        fields = ("uuid", "players", "phase", "current_round", "pads", "rounds")


class PlayerConnectedMessageSerializer(serializers.Serializer):
    message_type = serializers.CharField()
    player = PlayerSerializer()
