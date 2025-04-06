from rest_framework import serializers

from core.models import (
    Game,
    Pad,
    PadStep,
    Player,
    PlayerGameParticipation,
    Room,
    User,
    Vote,
)


class BaseSerializer(serializers.ModelSerializer):
    uuid = serializers.UUIDField(format="hex")


class UserSerializer(BaseSerializer):
    class Meta:
        model = User
        fields = ("email",)


class PlayerSerializer(BaseSerializer):
    rank = serializers.SerializerMethodField()

    def get_rank(self, obj):
        return obj.rank if hasattr(obj, "rank") else None

    class Meta:
        model = Player
        fields = ("uuid", "name", "color", "total_score", "rank", "avatar_url")


class PlayerWithUserSerializer(PlayerSerializer):
    user = UserSerializer()

    class Meta:
        model = Player
        fields = fields = PlayerSerializer.Meta.fields + ("user",)


class RoomSerializer(BaseSerializer):
    players = PlayerSerializer(many=True)
    admin = PlayerSerializer()
    current_game_id = serializers.UUIDField(format="hex")
    friendly_name = serializers.CharField()

    class Meta:
        model = Room
        fields = ("uuid", "players", "admin", "current_game_id", "friendly_name")


class VoteSerializer(BaseSerializer):
    player_id = serializers.UUIDField(format="hex")

    class Meta:
        model = Vote
        fields = ("player_id",)


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
            "drawing_url",
            "votes",
            "created_at",
        )


class PlayerGameParticipationSerializer(BaseSerializer):
    player = PlayerSerializer()

    class Meta:
        model = PlayerGameParticipation
        fields = (
            "player",
            "order",
        )


class GameWithParticipantsSerializer(BaseSerializer):
    participants = PlayerGameParticipationSerializer(many=True)

    class Meta:
        model = Game
        fields = (
            "uuid",
            "participants",
            "created_at",
        )


class PlayerGameParticipationWithGameSerializer(BaseSerializer):
    game = GameWithParticipantsSerializer()

    class Meta:
        model = PlayerGameParticipation
        fields = ("game",)


class PlayerWithHistorySerializer(PlayerSerializer):
    participations = PlayerGameParticipationWithGameSerializer(many=True)

    class Meta:
        model = Player
        fields = PlayerSerializer.Meta.fields + (
            "created_at",
            "participations",
        )


class PadIdSerializer(BaseSerializer):
    class Meta:
        model = Pad
        fields = ("uuid",)


class PadSerializer(BaseSerializer):
    steps = PadStepSerializer(many=True)

    class Meta:
        model = Pad
        fields = ("uuid", "steps", "order")


class GameSerializer(BaseSerializer):
    participants = PlayerGameParticipationSerializer(many=True)
    pads = PadSerializer(many=True)
    rounds = PadStepSerializer(many=True)

    class Meta:
        model = Game
        fields = (
            "uuid",
            "participants",
            "round_duration",
            "draw_own_word",
            "controlled_reveal",
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
    message_type = serializers.CharField(source="get_message_type")


class PlayerConnectedMessageSerializer(MessageSerializer):
    player = PlayerSerializer()


class PlayerFinishedMessageSerializer(MessageSerializer):
    player = PlayerSerializer()


class PlayerNotFinishedMessageSerializer(MessageSerializer):
    player = PlayerSerializer()


class PlayerLeftMessageSerializer(MessageSerializer):
    player = PlayerSerializer()
    needs_new_admin = serializers.BooleanField()


class PlayerReplacedMessageSerializer(MessageSerializer):
    old_player = PlayerSerializer()
    new_player = PlayerSerializer()


class NewAdminMessageSerializer(MessageSerializer):
    player = PlayerSerializer()


class GameStartsMessageSerializer(MessageSerializer):
    game = GameIdSerializer()


class RoundStartsMessageSerializer(MessageSerializer):
    game = GameIdSerializer()
    round_number = serializers.IntegerField()


class DebriefStartsMessageSerializer(MessageSerializer):
    game = GameIdSerializer()


class RevealStartsMessageSerializer(MessageSerializer):
    game = GameIdSerializer()


class PlayerViewingPadMessageSerializer(MessageSerializer):
    pad = PadIdSerializer()
    player = PlayerSerializer()


class VoteResultsStartsMessageSerializer(MessageSerializer):
    game = GameIdSerializer()
