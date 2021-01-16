import { Game, GamePhase } from 'redux/Game/types';
import { Player } from 'redux/Player/types';
import { Room } from 'redux/Room/types';

export const getRedirectPath = (room: Room, game: Game, player: Player): string => {
  switch (game.phase) {
    case GamePhase.ROUNDS:
      const playerStep = game.rounds.find(
        (step) => step.player.uuid === player.uuid && step.round_number === game.current_round,
      );
      if (!playerStep) {
        throw new Error(
          `Step for player ${player.uuid} and round ${game.current_round} not found in game ${game.uuid}`,
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
  const stepCount = game.pads[0].steps.length;
  const playerCount = game.players.length;
  const choiceCount = stepCount * (playerCount - 1);
  return Math.max(1, Math.round(Math.sqrt(0.6 * choiceCount - 1)));
};

export const getReorderedPlayers = (game: Game, player: Player): Player[] => {
  const currentPlayerPad = game.pads.find((pad) =>
    pad.steps.some(
      (step) => step.round_number === game.current_round && step.player.uuid === player.uuid,
    ),
  );
  if (!currentPlayerPad) {
    throw new Error(
      `Step for player ${player.uuid} and round ${game.current_round} not found in game ${game.uuid}`,
    );
  }

  return currentPlayerPad.steps.map((step) => step.player);
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
  switch (game.phase) {
    case GamePhase.ROUNDS:
      // TODO this does not apply to drawing steps
      return game.rounds
        .filter((padStep) => padStep.round_number === game.current_round && !padStep.sentence)
        .map((padStep) => padStep.player);
    case GamePhase.DEBRIEF:
      const voteCountByPlayer = game.rounds.reduce((acc, padStep) => {
        padStep.votes.forEach((vote) => {
          if (!acc[vote.player_id]) {
            acc[vote.player_id] = 0;
          }
          acc[vote.player_id] = acc[vote.player_id] + 1;
        });
        return acc;
      }, {} as Record<string, number>);

      return game.players.filter(
        (player) =>
          !voteCountByPlayer[player.uuid] ||
          voteCountByPlayer[player.uuid] < getAvailableVoteCount(game),
      );
    default:
      return [];
  }
};
