import logging
from math import sqrt
from random import sample
from typing import List

import requests
from django.conf import settings
from django.db import transaction
from django.db.models import Count
from django_eventstream import send_event

from core.messages import (
    DebriefStartsMessage,
    PlayerFinishedMessage,
    PlayerNotFinishedMessage,
    RevealStartsMessage,
    RoundStartsMessage,
    VoteResultsStartsMessage,
)
from core.models import (
    Game,
    GamePhase,
    Pad,
    PadStep,
    Player,
    PlayerGameParticipation,
    Room,
    StepType,
    Vote,
)

logger = logging.getLogger(__name__)


class VoteException(Exception):
    pass


def get_round_count(game: Game):
    player_count = game.participants.count()
    # There should always be an even number of steps - the first player will play a step on their pad
    # or won't depending on that
    return 2 * ((player_count + int(game.draw_own_word) - 1) // 2)


def order_players(players: List[Player], requested_players_order: List[str]):
    if requested_players_order is None:
        return sample(players, len(players))

    def sort_fn(player: Player):
        try:
            return requested_players_order.index(player.uuid.hex)
        except ValueError:
            return -1

    return sorted(players, key=sort_fn)


def get_available_vote_count(game: Game):
    round_count = get_round_count(game)
    choice_count = round_count * (game.participants.count() - 1)
    return max(1, round(sqrt(0.6 * choice_count - 1)))


def initialize_game(
    room: Room,
    requested_players_order: List[str],
    round_duration: int,
    draw_own_word: bool,
    controlled_reveal: bool,
):
    logger.debug("Initializing game for room %s" % room.uuid)

    players = list(room.players.all())
    player_count = len(players)
    even_players = player_count % 2 == 0

    game = Game.objects.create(
        room=room,
        round_duration=round_duration,
        draw_own_word=(player_count == 2 or (even_players and draw_own_word)),
        controlled_reveal=controlled_reveal,
    )

    ordered_players = order_players(players, requested_players_order)

    for index, player in enumerate(ordered_players):
        PlayerGameParticipation.objects.create(game=game, player=player, order=index)

    for index in range(len(ordered_players)):
        initialize_pad(game, index, ordered_players)

    return game


def initialize_pad(game: Game, index: int, players: List[Player]):
    logger.debug(
        "Initializing pad for player %s (index %d)" % (players[index].name, index)
    )
    pad = Pad.objects.create(game=game, order=index)
    player_count = len(players)

    step_count = get_round_count(game)

    logger.debug(
        "Initializing pad step for pad %s, round %d, with player %s and mode %s"
        % (pad.uuid.hex[:8], 0, players[index], "INITIAL")
    )
    PadStep.objects.create(
        pad=pad, player=players[index], round_number=0, step_type="INITIAL",
    )

    for round_number in range(1, step_count + 1):
        step_player = (
            players[(index + round_number - 1) % player_count]
            if game.draw_own_word
            else players[(index + round_number) % player_count]
        )
        step_type = (
            StepType.DRAWING_TO_WORD
            if round_number % 2 == 0
            else StepType.WORD_TO_DRAWING
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


def handle_player_done(game, player, callback):
    send_event(
        "game-%s" % game.uuid.hex,
        "message",
        PlayerFinishedMessage(player).serialize(),
    )

    with transaction.atomic():
        game = Game.objects.select_for_update().get(uuid=game.uuid)
        game.pads_done = game.pads_done + 1
        game.save()

    if game.pads_done == game.participants.count():
        callback()
        # start_next_round(game, game.current_round + 1)


def handle_player_no_longer_done(game, player):
    send_event(
        "game-%s" % game.uuid.hex,
        "message",
        PlayerNotFinishedMessage(player).serialize(),
    )
    with transaction.atomic():
        game = Game.objects.select_for_update().get(uuid=game.uuid)
        game.pads_done = game.pads_done - 1
        game.save()


def save_sentence_step(step, sentence):
    is_done = not is_valid_sentence(step.sentence) and is_valid_sentence(sentence)
    is_no_longer_done = is_valid_sentence(step.sentence) and not is_valid_sentence(
        sentence
    )
    step.sentence = sentence
    step.save()

    game = step.pad.game

    def on_finished():
        start_next_round(game, game.current_round + 1)

    if is_done:
        handle_player_done(game, step.player, on_finished)

    if is_no_longer_done:
        handle_player_no_longer_done(game, step.player)


def save_drawing(step, drawing):
    base_api = settings.DRAWING_RENDERER_HOST
    url = base_api + "drawings/" + str(step.uuid)

    r = requests.post(url, json={"drawing": drawing})
    r.raise_for_status()

    return r.json()["publicPath"]


def save_drawing_step(step, drawing):
    drawing_url = save_drawing(step, drawing)
    step.drawing_url = drawing_url
    step.save()

    game = step.pad.game

    def on_finished():
        start_next_round(game, game.current_round + 1)

    handle_player_done(step.pad.game, step.player, on_finished)


def vote(player, step):
    game = step.pad.game
    available_vote_count = get_available_vote_count(game)

    with transaction.atomic():
        participation = PlayerGameParticipation.objects.get(player=player, game=game)
        existing_vote_count = participation.vote_count

        if existing_vote_count >= available_vote_count:
            raise VoteException(
                "You already reached the maximal number of vote for this game : %s"
                % available_vote_count
            )

        participation.vote_count = existing_vote_count + 1
        participation.save()

    Vote.objects.create(player=player, pad_step=step)

    def on_finished():
        switch_to_vote_results(game)

    if existing_vote_count + 1 == available_vote_count:
        handle_player_done(game, player, on_finished)


def devote(player, step):
    game = step.pad.game
    available_vote_count = get_available_vote_count(game)

    with transaction.atomic():
        participation = PlayerGameParticipation.objects.get(player=player, game=game)
        existing_vote_count = participation.vote_count
        participation.vote_count = existing_vote_count - 1
        participation.save()

    vote = Vote.objects.filter(player=player, pad_step=step).first()
    if vote is None:
        raise VoteException("You didn't vote for pad_step %s" % step.uuid.hex)

    vote.delete()

    if existing_vote_count == available_vote_count:
        handle_player_no_longer_done(game, player)


def start_next_round(game: Game, new_round: int):
    round_count = get_round_count(game)
    if new_round > round_count:
        return start_reveal(game) if game.controlled_reveal else start_debrief(game)
    game.current_round = new_round
    game.pads_done = 0
    game.save()
    for pad in game.pads.all():
        previous_step = pad.steps.get(round_number=new_round - 1)
        step = pad.steps.get(round_number=new_round)
        if new_round % 2 == 0:
            step.drawing_url = previous_step.drawing_url
        else:
            step.sentence = previous_step.sentence
        step.save()

    send_event(
        "game-%s" % game.uuid.hex,
        "message",
        RoundStartsMessage(game, round_number=new_round).serialize(),
    )


def switch_to_vote_results(game: Game):
    game.phase = GamePhase.VOTE_RESULTS.value
    game.save()

    game_players = (
        Player.objects.filter(steps__pad__game=game)
        .annotate(vote_count=Count("steps__votes"))
        .filter(vote_count__gt=0)
    )

    for player in game_players:
        player.total_score += player.vote_count
        player.save()

    send_event(
        "game-%s" % game.uuid.hex,
        "message",
        VoteResultsStartsMessage(game).serialize(),
    )


def start_reveal(game: Game):
    game.current_round = 0
    game.pads_done = 0
    game.phase = GamePhase.REVEAL.value
    message = RevealStartsMessage(game).serialize()

    game.save()
    send_event(
        "game-%s" % game.uuid.hex, "message", message,
    )
    send_event(
        "room-%s" % game.room.uuid.hex, "message", message,
    )


def start_debrief(game: Game):
    game.current_round = 0
    game.pads_done = 0
    game.phase = GamePhase.DEBRIEF.value
    message = DebriefStartsMessage(game).serialize()

    game.save()
    send_event(
        "game-%s" % game.uuid.hex, "message", message,
    )
    send_event(
        "room-%s" % game.room.uuid.hex, "message", message,
    )


class GameStateException(Exception):
    pass


class GamePhaseAssertionException(GameStateException):
    def __init__(self, expected, actual):
        message = "Expected game to be at phase %s, actual phase %s" % (
            expected,
            actual,
        )
        super(Exception, self).__init__(message)
        self.expected = expected
        self.actual = actual


class GameRoundAssertionException(GameStateException):
    def __init__(self, expected, actual):
        message = "Expected game to be at round %d, actual round %d" % (
            expected,
            actual,
        )
        super(Exception, self).__init__(message)
        self.expected = expected
        self.actual = actual


def assert_phase(game: Game, expected_phase: GamePhase):
    if game.phase != expected_phase.value:
        raise GamePhaseAssertionException(expected_phase.value, game.phase)


def assert_round(game: Game, expected_round: int):
    if game.current_round != expected_round:
        raise GameRoundAssertionException(expected_round, game.current_round)


def is_valid_sentence(sentence):
    return sentence is not None and sentence != ""
