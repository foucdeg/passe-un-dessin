import { Game, PadStep, GamePhase } from 'redux/Game/types';
import { Player } from 'redux/Player/types';
import { Room } from 'redux/Room/types';

type PreviousNextSteps = [PadStep | null, PadStep | null];

export const getPreviousNextSteps = (game: Game, step: PadStep): PreviousNextSteps => {
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
        stepIndex > 0 ? pad.steps[stepIndex - 1] : null,
        stepIndex + 1 < pad.steps.length ? pad.steps[stepIndex + 1] : null,
      ];
    },
    [null, null] as PreviousNextSteps,
  );
};

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
  }
};
