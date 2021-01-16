from core.models import Game, Pad, Player


class PlayerConnectedMessage:
    message_type = "PLAYER_CONNECTED"
    player = None

    def __init__(self, player: Player):
        self.player = player

    def serialize(self):
        from core.serializers import PlayerConnectedMessageSerializer

        return PlayerConnectedMessageSerializer(self).data


class PlayerLeftMessage:
    message_type = "PLAYER_LEFT"
    player = None
    needs_new_admin = False

    def __init__(self, player: Player, needs_new_admin: bool):
        self.player = player
        self.needs_new_admin = needs_new_admin

    def serialize(self):
        from core.serializers import PlayerLeftMessageSerializer

        return PlayerLeftMessageSerializer(self).data


class PlayerReplacedMessage:
    message_type = "PLAYER_REPLACED"
    old_player = None
    new_player = None

    def __init__(self, old_player: Player, new_player: Player):
        self.old_player = old_player
        self.new_player = new_player

    def serialize(self):
        from core.serializers import PlayerReplacedMessageSerializer

        return PlayerReplacedMessageSerializer(self).data


class NewAdminMessage:
    message_type = "NEW_ADMIN"
    player = None

    def __init__(self, player: Player):
        self.player = player

    def serialize(self):
        from core.serializers import NewAdminMessageSerializer

        return NewAdminMessageSerializer(self).data


class PlayerFinishedMessage:
    message_type = "PLAYER_FINISHED"
    player = None

    def __init__(self, player: Player):
        self.player = player

    def serialize(self):
        from core.serializers import PlayerFinishedMessageSerializer

        return PlayerFinishedMessageSerializer(self).data


class PlayerNotFinishedMessage:
    message_type = "PLAYER_NOT_FINISHED"
    player = None

    def __init__(self, player: Player):
        self.player = player

    def serialize(self):
        from core.serializers import PlayerFinishedMessageSerializer

        return PlayerFinishedMessageSerializer(self).data


class GameStartsMessage:
    message_type = "GAME_STARTS"
    game = None

    def __init__(self, game: Game):
        self.game = game

    def serialize(self):
        from core.serializers import GameStartsMessageSerializer

        return GameStartsMessageSerializer(self).data


class RoundStartsMessage:
    message_type = "ROUND_STARTS"
    game = None
    round_number = None

    def __init__(self, game: Game, round_number: int):
        self.game = game
        self.round_number = round_number

    def serialize(self):
        from core.serializers import RoundStartsMessageSerializer

        return RoundStartsMessageSerializer(self).data


class DebriefStartsMessage:
    message_type = "DEBRIEF_STARTS"
    game = None

    def __init__(self, game: Game):
        self.game = game

    def serialize(self):
        from core.serializers import DebriefStartsMessageSerializer

        return DebriefStartsMessageSerializer(self).data


class RevealStartsMessage:
    message_type = "REVEAL_STARTS"
    game = None

    def __init__(self, game: Game):
        self.game = game

    def serialize(self):
        from core.serializers import RevealStartsMessageSerializer

        return RevealStartsMessageSerializer(self).data


class PlayerViewingPadMessage:
    message_type = "PLAYER_VIEWING_PAD"
    pad = None
    player = None

    def __init__(self, pad: Pad, player: Player):
        self.pad = pad
        self.player = player

    def serialize(self):
        from core.serializers import PlayerViewingPadMessageSerializer

        return PlayerViewingPadMessageSerializer(self).data


class VoteResultsStartsMessage:
    message_type = "VOTE_RESULTS_STARTS"
    game = None

    def __init__(self, game: Game):
        self.game = game

    def serialize(self):
        from core.serializers import VoteResultsStartsMessageSerializer

        return VoteResultsStartsMessageSerializer(self).data
