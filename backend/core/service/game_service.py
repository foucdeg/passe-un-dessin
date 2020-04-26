import logging
from random import sample
from typing import List

from core.messages import (
    AllVoteCountMessage,
    DebriefStartsMessage,
    RoundStartsMessage,
    VoteResultsStartsMessage,
)
from core.models import Game, GamePhase, Pad, PadStep, Player, Room, StepType, Vote
from django_eventstream import send_event

logger = logging.getLogger(__name__)


def get_round_count(game: Game):
    player_count = game.players.count()
    even_players = player_count % 2 == 0
    # There should always be an even number of steps - the first player will play a step on their pad
    # or won't depending on that
    return player_count if even_players else player_count - 1


def order_players(players: List[Player], requested_players_order: List[str]):
    if requested_players_order is None:
        return sample(players, len(players))

    def sort_fn(player: Player):
        return requested_players_order.index(player.uuid.hex)

    return sorted(players, key=sort_fn)


def get_available_vote_count(game: Game):
    player_count = game.players.count()
    if player_count <= 3:
        return 1
    return 3


def initialize_game(
    room: Room, requested_players_order: List[str], round_duration: int
):
    logger.debug("Initializing game for room %s" % room.uuid)

    game = Game.objects.create(room=room, round_duration=round_duration)

    players = list(room.players.all())
    ordered_players = order_players(players, requested_players_order)

    for player in ordered_players:
        player.game = game
        player.save()

    for index in range(len(ordered_players)):
        initialize_pad(game, index, ordered_players)

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


def switch_to_rounds(game: Game):
    game.phase = GamePhase.ROUNDS.value
    game.current_round = 0
    game.pads_done = 0
    game.save()
    for pad in game.pads.all():
        step = pad.steps.get(round_number=game.current_round)
        step.sentence = pad.sentence
        step.save()

    send_event(
        "game-%s" % game.uuid.hex, "message", RoundStartsMessage(game, 0).serialize(),
    )


def start_next_round(game: Game, new_round: int):
    round_count = get_round_count(game)
    if new_round >= round_count:
        return end_rounds(game)
    game.current_round = new_round
    game.pads_done = 0
    game.save()
    for pad in game.pads.all():
        previous_step = pad.steps.get(round_number=new_round - 1)
        step = pad.steps.get(round_number=new_round)
        if new_round % 2 == 0:
            step.sentence = previous_step.sentence
        else:
            step.drawing = previous_step.drawing
        step.save()

    send_event(
        "game-%s" % game.uuid.hex,
        "message",
        RoundStartsMessage(game, round_number=new_round).serialize(),
    )


def end_debrief(game: Game):
    game.phase = GamePhase.VOTE_RESULTS.value
    game.save()
    send_event(
        "game-%s" % game.uuid.hex,
        "message",
        VoteResultsStartsMessage(game).serialize(),
    )


def send_all_vote_count(game: Game):
    all_vote_count = Vote.objects.filter(pad_step__pad__game_id=game.uuid).count()
    send_event(
        "game-%s" % game.uuid.hex,
        "message",
        AllVoteCountMessage(all_vote_count).serialize(),
    )


def end_rounds(game: Game):
    game.phase = GamePhase.DEBRIEF.value
    game.current_round = None
    game.pads_done = 0
    game.save()
    send_event(
        "game-%s" % game.uuid.hex, "message", DebriefStartsMessage(game).serialize(),
    )
