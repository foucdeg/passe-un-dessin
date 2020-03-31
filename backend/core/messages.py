from core.models import Game, Player


class PlayerConnectedMessage:
    message_type = "PLAYER_CONNECTED"
    player = None

    def __init__(self, player: Player):
        self.player = player

    def serialize(self):
        from core.serializers import PlayerConnectedMessageSerializer

        return PlayerConnectedMessageSerializer(self).data


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
