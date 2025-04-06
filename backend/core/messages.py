import inflection

from core.models import Game, Pad, Player
from core.serializers import (
    DebriefStartsMessageSerializer,
    GameStartsMessageSerializer,
    MessageSerializer,
    NewAdminMessageSerializer,
    PlayerConnectedMessageSerializer,
    PlayerFinishedMessageSerializer,
    PlayerLeftMessageSerializer,
    PlayerNotFinishedMessageSerializer,
    PlayerReplacedMessageSerializer,
    PlayerViewingPadMessageSerializer,
    RevealStartsMessageSerializer,
    RoundStartsMessageSerializer,
    VoteResultsStartsMessageSerializer,
)


class SerializableMessage:
    serializer_class: type[MessageSerializer]

    def serialize(self):
        return self.serializer_class(self).data

    @classmethod
    def get_message_type(cls) -> str:
        if hasattr(cls, "message_type"):
            return cls.message_type

        return inflection.underscore(cls.__name__.replace("Message", "")).upper()


class PlayerConnectedMessage(SerializableMessage):
    serializer_class = PlayerConnectedMessageSerializer
    player: Player

    def __init__(self, player: Player):
        self.player = player


class PlayerLeftMessage(SerializableMessage):
    serializer_class = PlayerLeftMessageSerializer
    player: Player
    needs_new_admin: bool

    def __init__(self, player: Player, needs_new_admin: bool):
        self.player = player
        self.needs_new_admin = needs_new_admin


class PlayerReplacedMessage(SerializableMessage):
    serializer_class = PlayerReplacedMessageSerializer
    old_player: Player
    new_player: Player

    def __init__(self, old_player: Player, new_player: Player):
        self.old_player = old_player
        self.new_player = new_player


class NewAdminMessage(SerializableMessage):
    serializer_class = NewAdminMessageSerializer
    player: Player

    def __init__(self, player: Player):
        self.player = player


class PlayerFinishedMessage(SerializableMessage):
    serializer_class = PlayerFinishedMessageSerializer
    player: Player

    def __init__(self, player: Player):
        self.player = player


class PlayerNotFinishedMessage(SerializableMessage):
    serializer_class = PlayerNotFinishedMessageSerializer
    player: Player

    def __init__(self, player: Player):
        self.player = player


class GameStartsMessage(SerializableMessage):
    serialize_class = GameStartsMessageSerializer
    game: Game

    def __init__(self, game: Game):
        self.game = game


class RoundStartsMessage(SerializableMessage):
    serializer_class = RoundStartsMessageSerializer
    game: Game
    round_number: int

    def __init__(self, game: Game, round_number: int):
        self.game = game
        self.round_number = round_number


class DebriefStartsMessage(SerializableMessage):
    serializer_class = DebriefStartsMessageSerializer
    game: Game

    def __init__(self, game: Game):
        self.game = game


class RevealStartsMessage(SerializableMessage):
    serializer_class = RevealStartsMessageSerializer
    game: Game

    def __init__(self, game: Game):
        self.game = game


class PlayerViewingPadMessage(SerializableMessage):
    serializer_class = PlayerViewingPadMessageSerializer
    pad: Pad
    player: Player

    def __init__(self, pad: Pad, player: Player):
        self.pad = pad
        self.player = player


class VoteResultsStartsMessage(SerializableMessage):
    serializer_class = VoteResultsStartsMessageSerializer
    game: Game

    def __init__(self, game: Game):
        self.game = game
