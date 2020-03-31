from rest_framework import serializers

from core.models import Game, Pad, PadStep, Player, Room


class BaseSerializer(serializers.ModelSerializer):
    uuid = serializers.UUIDField(format="hex")


class PlayerSerializer(BaseSerializer):
    class Meta:
        model = Player
        fields = ("uuid", "name")


class RoomSerializer(BaseSerializer):
    players = PlayerSerializer(many=True)
    admin = PlayerSerializer()

    class Meta:
        model = Room
        fields = ("uuid", "players", "admin")


class PadStepSerializer(BaseSerializer):
    player = PlayerSerializer()

    class Meta:
        model = PadStep
        fields = ("uuid", "step_type", "round_number", "player", "sentence", "drawing")


class PadSerializer(BaseSerializer):
    initial_player = PlayerSerializer()
    steps = serializers.SerializerMethodField()

    def get_steps(self, instance):
        steps = instance.steps.all().order_by("round_number")
        return PadStepSerializer(steps, many=True).data

    class Meta:
        model = Pad
        fields = ("uuid", "initial_player", "steps", "order", "sentence")


class GameSerializer(BaseSerializer):
    players = PlayerSerializer(many=True)
    pads = serializers.SerializerMethodField()
    rounds = PadStepSerializer(many=True)

    def get_pads(self, instance):
        pads = instance.pads.all().order_by("order")
        return PadSerializer(pads, many=True).data

    class Meta:
        model = Game
        fields = ("uuid", "players", "phase", "current_round", "pads", "rounds")


class GameIdSerializer(BaseSerializer):
    class Meta:
        model = Game
        fields = ("uuid",)


class MessageSerializer(serializers.Serializer):
    message_type = serializers.CharField()


class PlayerConnectedMessageSerializer(MessageSerializer):
    player = PlayerSerializer()


class GameStartsMessageSerializer(MessageSerializer):
    game = GameIdSerializer()


class RoundStartsMessageSerializer(MessageSerializer):
    game = GameIdSerializer()
    round_number = serializers.IntegerField()
