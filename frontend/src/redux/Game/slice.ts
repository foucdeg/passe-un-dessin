import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Player } from 'redux/Player/types';
import { Game, Pad, GamePhase, PadStep } from './types';

export type GameState = Readonly<{
  viewingAsPublic: boolean;
  game: Game | null;
  gameStructure: Game | null;
  remainingPlayers: Player[];
  suggestions: string[];
  recapViews: { [padUuid: string]: Player[] };
  winners: PadStep[] | null;
}>;

const initialState: GameState = {
  viewingAsPublic: true,
  game: null,
  gameStructure: null,
  remainingPlayers: [],
  suggestions: [],
  recapViews: {},
  winners: null,
} as GameState;

const gameSlice = createSlice({
  name: 'Game',
  initialState,
  reducers: {
    updateGame: (
      state,
      action: PayloadAction<{ game: Game; keepStructure: boolean; asPublic: boolean }>,
    ) => {
      state.game = action.payload.game;
      if (!action.payload.keepStructure) {
        state.gameStructure = action.payload.game;
      }

      if (!state.game) return;

      state.remainingPlayers = state.game.players;
      state.recapViews = state.game.pads.reduce(
        (acc, pad) => ({ ...acc, [pad.uuid]: [] }),
        {} as { [padUuid: string]: Player[] },
      );

      const firstPadUUID = state.game.pads[0].uuid;
      state.recapViews[firstPadUUID] = [...state.game.players];
      state.suggestions = [];
      state.viewingAsPublic = action.payload.asPublic;
    },
    updatePad: (state, action: PayloadAction<Pad>) => {
      if (!state.game) return;

      const matchingPadIndex = state.game?.pads.findIndex(
        (pad) => pad.uuid === action.payload.uuid,
      );

      state.game.pads[matchingPadIndex] = action.payload;
    },
    addVoteToPadStep: (state, action: PayloadAction<{ padStepId: string; player: Player }>) => {
      if (!state.game) return;
      const { player, padStepId } = action.payload;

      state.game.pads.forEach((pad) =>
        pad.steps
          .filter((step) => step.uuid === padStepId)
          .forEach((padStep) => padStep.votes.push({ player })),
      );
    },
    removeVoteFromPadStep: (
      state,
      action: PayloadAction<{ padStepId: string; player: Player }>,
    ) => {
      if (!state.game) return;
      const { player, padStepId } = action.payload;

      state.game.pads.forEach((pad) =>
        pad.steps
          .filter((step) => step.uuid === padStepId)
          .forEach((padStep) => {
            const firstVoteIndex = padStep.votes.findIndex(
              (vote) => vote.player.uuid === player.uuid,
            );
            if (firstVoteIndex === -1) return;

            padStep.votes.splice(firstVoteIndex, 1);
          }),
      );
    },
    startRound: (state, action: PayloadAction<{ roundNumber?: number }>) => {
      if (!state.game) return;

      state.game.phase = GamePhase.ROUNDS;
      state.game.current_round = action.payload.roundNumber || 0;
      state.remainingPlayers = state.game.players;
    },
    markPlayerFinished: (state, action: PayloadAction<Player>) => {
      state.remainingPlayers = state.remainingPlayers.filter(
        (remPlayer) => remPlayer.uuid !== action.payload.uuid,
      );
    },
    markPlayerNotFinished: (state, action: PayloadAction<Player>) => {
      if (!state.remainingPlayers.some((remPlayer) => remPlayer.uuid === action.payload.uuid)) {
        state.remainingPlayers.push(action.payload);
      }
    },
    setSuggestions: (state, action: PayloadAction<string[]>) => {
      state.suggestions = action.payload;
    },
    setPlayerViewingPad: (state, action: PayloadAction<{ player: Player; pad: Pad }>) => {
      for (const padId in state.recapViews) {
        state.recapViews[padId] = state.recapViews[padId].filter(
          (viewer) => viewer.uuid !== action.payload.player.uuid,
        );
      }
      state.recapViews[action.payload.pad.uuid].push(action.payload.player);
    },
    setWinners: (state, action: PayloadAction<PadStep[]>) => {
      state.winners = action.payload;
    },
    resetGameMetadata: (state) => {
      state.winners = null;
    },
  },
});

export const {
  updateGame,
  updatePad,
  startRound,
  markPlayerFinished,
  markPlayerNotFinished,
  setSuggestions,
  setPlayerViewingPad,
  setWinners,
  addVoteToPadStep,
  removeVoteFromPadStep,
  resetGameMetadata,
} = gameSlice.actions;
export default gameSlice.reducer;
