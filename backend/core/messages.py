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
