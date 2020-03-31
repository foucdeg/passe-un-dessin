import logging
from random import shuffle
from typing import List

from core.models import Game, Pad, PadStep, Player, Room, StepType

logger = logging.getLogger(__name__)


def get_round_count(game: Game):
    player_count = game.players.count()
    even_players = player_count % 2 == 0
    # There should always be an even number of steps - the first player will play a step on their pad
    # or won't depending on that
    return player_count if even_players else player_count - 1


def initialize_game(room: Room):
    logger.debug("Initializing game for room %s" % room.uuid)

    game = Game.objects.create(room=room)

    players = list(room.players.all())
    shuffle(players)  # TODO more player ordering strategies
    for player in players:
        player.game = game
        player.save()

    for index in range(len(players)):
        initialize_pad(game, index, players)

    return game


def initialize_pad(game: Game, index: int, players: List[Player]):
    logger.debug(
        "Initializing pad for player %s (index %d)" % (players[index].name, index)
    )
    pad = Pad.objects.create(game=game, initial_player=players[index], order=index)
    player_count = len(players)

    even_players = player_count % 2 == 0
    step_count = get_round_count(game)

    for round_number in range(step_count):
        step_player = (
            players[(index + round_number) % player_count]
            if even_players
            else players[(index + round_number + 1) % player_count]
        )
        step_type = (
            StepType.WORD_TO_DRAWING
            if round_number % 2 == 0
            else StepType.DRAWING_TO_WORD
        )
        logger.debug(
            "Initializing pad step for pad %s, round %d, with player %s and mode %s"
            % (pad.uuid.hex[:8], round_number, step_player.name, step_type.value)
        )

        PadStep.objects.create(
            pad=pad,
            player=step_player,
            round_number=round_number,
            step_type=step_type.value,
        )


def all_pads_initialized(game: Game):
    return all([pad.sentence is not None for pad in game.pads.all()])
