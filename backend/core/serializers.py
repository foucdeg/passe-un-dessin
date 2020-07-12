from rest_framework import serializers

from core.models import (
    Game,
    Pad,
    PadStep,
    Player,
    PlayerGameParticipation,
    Room,
    Vote,
)


class BaseSerializer(serializers.ModelSerializer):
    uuid = serializers.UUIDField(format="hex")


class PlayerSerializer(BaseSerializer):
    class Meta:
        model = Player
        fields = ("uuid", "name", "color")


class RoomSerializer(BaseSerializer):
    players = PlayerSerializer(many=True)
    admin = PlayerSerializer()
    current_game_id = serializers.UUIDField(format="hex")
    friendly_name = serializers.CharField()

    class Meta:
        model = Room
        fields = ("uuid", "players", "admin", "current_game_id", "friendly_name")


class VoteSerializer(BaseSerializer):
    player = PlayerSerializer()

    class Meta:
        model = Vote
        fields = ("player",)


class PadStepSerializer(BaseSerializer):
    player = PlayerSerializer()
    votes = VoteSerializer(many=True)

    class Meta:
        model = PadStep
        fields = (
            "uuid",
            "step_type",
            "round_number",
            "player",
            "sentence",
            "drawing",
            "votes",
        )


class PlayerGameParticipationSerializer(BaseSerializer):
    player = PlayerSerializer()

    class Meta:
        model = PlayerGameParticipation
        fields = (
            "player",
            "order",
        )


class PadIdSerializer(BaseSerializer):
    class Meta:
        model = Pad
        fields = ("uuid",)


class PadSerializer(BaseSerializer):
    initial_player = PlayerSerializer()
    steps = PadStepSerializer(many=True)

    class Meta:
        model = Pad
        fields = ("uuid", "initial_player", "steps", "order", "sentence")


class GameSerializer(BaseSerializer):
    participants = PlayerGameParticipationSerializer(many=True)
    pads = PadSerializer(many=True)
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
            try:
                return unique_ordered_player_uuids.index(player.uuid.hex)
            except ValueError:
                return -1

        sorted_players = sorted(players, key=sort_fn)

        return PlayerSerializer(sorted_players, many=True).data

    class Meta:
        model = Game
        fields = (
            "uuid",
            "participants",
            "round_duration",
            "draw_own_word",
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


class PlayerNotFinishedMessageSerializer(MessageSerializer):
    player = PlayerSerializer()


class PlayerLeftMessageSerializer(MessageSerializer):
    player = PlayerSerializer()
    needs_new_admin = serializers.BooleanField()


class NewAdminMessageSerializer(MessageSerializer):
    player = PlayerSerializer()


class GameStartsMessageSerializer(MessageSerializer):
    game = GameIdSerializer()


class RoundStartsMessageSerializer(MessageSerializer):
    game = GameIdSerializer()
    round_number = serializers.IntegerField()


class DebriefStartsMessageSerializer(MessageSerializer):
    game = GameIdSerializer()


class PlayerViewingPadMessageSerializer(MessageSerializer):
    pad = PadIdSerializer()
    player = PlayerSerializer()


class VoteResultsStartsMessageSerializer(MessageSerializer):
    game = GameIdSerializer()
