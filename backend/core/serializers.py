from rest_framework import serializers

from core.models import Game, Pad, PadStep, Player, Room


class BaseSerializer(serializers.ModelSerializer):
    uuid = serializers.UUIDField(format="hex")


class PlayerSerializer(BaseSerializer):
    class Meta:
        model = Player
        fields = ("uuid", "name", "color")


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
    players = serializers.SerializerMethodField()
    pads = serializers.SerializerMethodField()
    rounds = PadStepSerializer(many=True)

    def get_players(self, instance):
        def uniquify(seq):
            seen = set()
            seen_add = seen.add
            return [x for x in seq if not (x in seen or seen_add(x))]

        players = instance.players.all()

        pad = instance.pads.first()

        ordered_player_uuids = [pad.initial_player.uuid.hex] + [
            step.player.uuid.hex for step in pad.steps.all().order_by("round_number")
        ]
        unique_ordered_player_uuids = uniquify(ordered_player_uuids)

        def sort_fn(player: Player):
            return unique_ordered_player_uuids.index(player.uuid.hex)

        sorted_players = sorted(players, key=sort_fn)

        return PlayerSerializer(sorted_players, many=True).data

    def get_pads(self, instance):
        pads = instance.pads.all().order_by("order")
        return PadSerializer(pads, many=True).data

    class Meta:
        model = Game
        fields = (
            "uuid",
            "players",
            "round_duration",
            "phase",
            "current_round",
            "pads",
            "rounds",
        )


class GameIdSerializer(BaseSerializer):
    class Meta:
        model = Game
        fields = ("uuid",)


class MessageSerializer(serializers.Serializer):
    message_type = serializers.CharField()


class PlayerConnectedMessageSerializer(MessageSerializer):
    player = PlayerSerializer()


class PlayerFinishedMessageSerializer(MessageSerializer):
    player = PlayerSerializer()


class PlayerLeftMessageSerializer(MessageSerializer):
    player = PlayerSerializer()


class NewAdminMessageSerializer(MessageSerializer):
    player = PlayerSerializer()


class GameStartsMessageSerializer(MessageSerializer):
    game = GameIdSerializer()


class RoundStartsMessageSerializer(MessageSerializer):
    game = GameIdSerializer()
    round_number = serializers.IntegerField()


class DebriefStartsMessageSerializer(MessageSerializer):
    game = GameIdSerializer()
