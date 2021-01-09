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


def get_generic_avatar_url(player):
    if not player.avatar:
        return None
    return "/drawings/avatar/%s/%s.png" % (player.uuid, player.avatar[-10:])


class PlayerSerializer(BaseSerializer):
    avatar_url = serializers.SerializerMethodField()

    def get_avatar_url(self, obj):
        if not obj.avatar:
            return None
        return "/drawings/avatar/%s/%s.png" % (obj.uuid, obj.avatar[-10:])

    class Meta:
        model = Player
        fields = ("uuid", "name", "color", "total_score", "avatar_url")


class PlayerWithAvatarSerializer(PlayerSerializer):
    class Meta:
        model = Player
        fields = ("uuid", "name", "color", "total_score", "avatar", "avatar_url")


class PlayerWithUserAndAvatarSerializer(PlayerWithAvatarSerializer):
    user = UserSerializer()

    class Meta:
        model = Player
        fields = (
            "uuid",
            "name",
            "color",
            "total_score",
            "user",
            "avatar_url",
            "avatar",
        )


class PlayerInRankingSerializer(PlayerSerializer):
    rank = serializers.IntegerField()

    class Meta:
        model = Player
        fields = ("uuid", "name", "color", "total_score", "rank", "avatar_url")


class RoomSerializer(BaseSerializer):
    players = PlayerSerializer(many=True)
    admin = PlayerSerializer()
    current_game_id = serializers.UUIDField(format="hex")
    friendly_name = serializers.CharField()

    class Meta:
        model = Room
        fields = ("uuid", "players", "admin", "current_game_id", "friendly_name")


class VoteSerializer(BaseSerializer):
    class Meta:
        model = Vote
        fields = ("player_id",)


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
        fields = (
            "uuid",
            "name",
            "color",
            "total_score",
            "created_at",
            "avatar_url",
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


class PlayerViewingPadMessageSerializer(MessageSerializer):
    pad = PadIdSerializer()
    player = PlayerSerializer()


class VoteResultsStartsMessageSerializer(MessageSerializer):
    game = GameIdSerializer()
