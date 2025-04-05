import { Game, GamePhase } from 'redux/Game/types';
import { Player } from 'redux/Player/types';
import { Room } from 'redux/Room/types';

export const getRedirectPath = (room: Room, game: Game, playerId: string): string => {
  const playerStep = game.rounds.find(
    (step) => step.player.uuid === playerId && step.round_number === game.current_round,
  );

  switch (game.phase) {
    case GamePhase.ROUNDS:
      if (!playerStep) {
        throw new Error(
          `Step for player ${playerId} and round ${game.current_round} not found in game ${game.uuid}`,
        );
      }
      return `/room/${room.uuid}/game/${game.uuid}/step/${playerStep.uuid}`;
    case GamePhase.REVEAL:
      return `/room/${room.uuid}/game/${game.uuid}/recap`;
    case GamePhase.DEBRIEF:
      return `/room/${room.uuid}/game/${game.uuid}/recap`;
    case GamePhase.VOTE_RESULTS:
      return `/room/${room.uuid}/game/${game.uuid}/vote-results`;
  }
};

export const getAvailableVoteCount = (game: Game): number => {
  const stepCount = game.pads[0].steps.length - 1;
  const playerCount = game.players.length;
  const choiceCount = stepCount * (playerCount - 1);
  return Math.max(1, Math.round(Math.sqrt(0.6 * choiceCount - 1)));
};

export const getReorderedPlayers = (game: Game, playerId: string): Player[] => {
  const currentPad = game.pads.find((pad) =>
    pad.steps.some(
      (step) => step.round_number === game.current_round && step.player.uuid === playerId,
    ),
  );
  if (!currentPad) {
    throw new Error(
      `Step for player ${playerId} and round ${game.current_round} not found in game ${game.uuid}`,
    );
  }

  return currentPad.steps.map((step) => step.player);
};

export const getNextPhaseAndRound = (game: Game): [GamePhase, number] => {
  switch (game.phase) {
    case GamePhase.ROUNDS: {
      const nextRoundNumber = (game.current_round || 0) + 1;
      const roundCount = game.pads[0].steps.length;

      if (nextRoundNumber > roundCount) {
        return [GamePhase.DEBRIEF, 0];
      }
      return [GamePhase.ROUNDS, nextRoundNumber];
    }
    case GamePhase.REVEAL:
      return [GamePhase.DEBRIEF, 0];
    case GamePhase.DEBRIEF:
    case GamePhase.VOTE_RESULTS:
      return [GamePhase.VOTE_RESULTS, 0];
  }
};

export const findRemainingPlayers = (game: Game): Player[] => {
  const voteCountByPlayer = game.rounds.reduce(
    (acc, padStep) => {
      padStep.votes.forEach((vote) => {
        if (!acc[vote.player_id]) {
          acc[vote.player_id] = 0;
        }
        acc[vote.player_id] = acc[vote.player_id] + 1;
      });
      return acc;
    },
    {} as Record<string, number>,
  );

  switch (game.phase) {
    case GamePhase.ROUNDS:
      // TODO this does not apply to drawing steps
      return game.rounds
        .filter((padStep) => padStep.round_number === game.current_round && !padStep.sentence)
        .map((padStep) => padStep.player);
    case GamePhase.DEBRIEF:
      return game.players.filter(
        (player) =>
          !voteCountByPlayer[player.uuid] ||
          voteCountByPlayer[player.uuid] < getAvailableVoteCount(game),
      );
    default:
      return [];
  }
};
