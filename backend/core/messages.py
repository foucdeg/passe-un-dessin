from core.models import Player


class PlayerConnectedMessage:
    message_type = "PLAYER_CONNECTED"
    player = None

    def __init__(self, player: Player):
        self.player = player
