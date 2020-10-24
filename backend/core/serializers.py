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


class PlayerWithUserSerializer(BaseSerializer):
    user = UserSerializer()

    class Meta:
        model = Player
        fields = ("uuid", "name", "color", "user")


class PlayerSerializer(BaseSerializer):
    class Meta:
        model = Player
        fields = ("uuid", "name", "color")


class PlayerInRankingSerializer(BaseSerializer):
    vote_count = serializers.IntegerField()

    class Meta:
        model = Player
        fields = ("uuid", "name", "color", "vote_count")


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
    drawing_url = serializers.SerializerMethodField()

    def get_drawing_url(self, obj):
        return "/drawings/%s.png" % obj.uuid

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


class PlayerWithHistorySerializer(BaseSerializer):
    participations = PlayerGameParticipationWithGameSerializer(many=True)

    class Meta:
        model = Player
        fields = ("uuid", "name", "color", "created_at", "participations")


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
