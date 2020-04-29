import { Game, PadStep, GamePhase } from 'redux/Game/types';
import { Player } from 'redux/Player/types';
import { Room } from 'redux/Room/types';

type PreviousNextPlayersForStep = [Player | null, Player | null];
type PreviousNextPlayers = [Player, Player];

export const getRedirectPath = (room: Room, game: Game, player: Player) => {
  switch (game.phase) {
    case GamePhase.INIT:
      const playerPad = game.pads.find(pad => pad.initial_player.uuid === player.uuid);
      if (!playerPad) {
        throw new Error(`Pad for player ${player.uuid} not found in game ${game.uuid}`);
      }
      return `/room/${room.uuid}/game/${game.uuid}/pad/${playerPad.uuid}/init`;
    case GamePhase.ROUNDS:
      const playerStep = game.rounds.find(
        step => step.player.uuid === player.uuid && step.round_number === game.current_round,
      );
      if (!playerStep) {
        throw new Error(
          `Step for player ${player.uuid} and round ${game.current_round} not found in game ${game.uuid}`,
        );
      }
      return `/room/${room.uuid}/game/${game.uuid}/step/${playerStep.uuid}`;
    case GamePhase.DEBRIEF:
      return `/room/${room.uuid}/game/${game.uuid}/recap`;
    case GamePhase.VOTE_RESULTS:
      return `/room/${room.uuid}/game/${game.uuid}/vote-results`;
  }
};

export const getPreviousNextPlayersForStep = (
  game: Game,
  step: PadStep,
): PreviousNextPlayersForStep => {
  return game.pads.reduce(
    (accumulator, pad) => {
      if (accumulator[0]) {
        return accumulator;
      }
      const stepIndex = pad.steps.findIndex(padStep => padStep.uuid === step.uuid);
      if (stepIndex === -1) {
        return accumulator;
      }
      return [
        stepIndex > 0 ? pad.steps[stepIndex - 1].player : pad.initial_player,
        stepIndex + 1 < pad.steps.length ? pad.steps[stepIndex + 1].player : null,
      ];
    },
    [null, null] as PreviousNextPlayersForStep,
  );
};

export const getPreviousNextPlayers = (game: Game, player: Player): PreviousNextPlayers => {
  const playerIndex = game.players.findIndex(gamePlayer => gamePlayer.uuid === player.uuid);

  return [
    game.players[(game.players.length + playerIndex - 1) % game.players.length],
    game.players[(playerIndex + 1) % game.players.length],
  ];
};

export const getAvailableVoteCount = (game: Game): number => {
  if (game.players.length <= 3) return 1;
  return 3;
};

export const getReorderedPlayers = (game: Game, player: Player): Player[] => {
  const currentPlayerPad = game.pads.find(pad =>
    game.phase === GamePhase.INIT
      ? pad.initial_player.uuid === player.uuid
      : pad.steps.some(
          step => step.round_number === game.current_round && step.player.uuid === player.uuid,
        ),
  );
  if (!currentPlayerPad) {
    throw new Error(
      `Step for player ${player.uuid} and round ${game.current_round} not found in game ${game.uuid}`,
    );
  }

  return [currentPlayerPad.initial_player, ...currentPlayerPad.steps.map(step => step.player)];
};
