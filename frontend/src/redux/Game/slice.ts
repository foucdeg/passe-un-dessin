import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Player } from 'redux/Player/types';
import { findRemainingPlayers } from 'services/game.service';
import { Game, Pad, GamePhase, PadStep } from './types';

export type GameState = Readonly<{
  game: Game | null;
  gameStructure: Game | null;
  remainingPlayers: Player[];
  suggestions: string[];
  recapViews: { [padUuid: string]: Player[] };
  selectedPadUuid: string | null;
  winners: PadStep[] | null;
}>;

const initialState: GameState = {
  game: null,
  gameStructure: null,
  remainingPlayers: [],
  suggestions: [],
  recapViews: {},
  selectedPadUuid: null,
  winners: null,
} as GameState;

const gameSlice = createSlice({
  name: 'Game',
  initialState,
  reducers: {
    updateGame: (state, action: PayloadAction<{ game: Game; keepStructure: boolean }>) => {
      state.game = action.payload.game;
      if (!action.payload.keepStructure) {
        state.gameStructure = action.payload.game;
      }

      if (!state.game) return;

      state.remainingPlayers = findRemainingPlayers(state.game);
      state.recapViews = state.game.pads.reduce(
        (acc, pad) => ({ ...acc, [pad.uuid]: [] }),
        {} as { [padUuid: string]: Player[] },
      );

      const firstPadUUID = state.game.pads[0].uuid;
      state.recapViews[firstPadUUID] = [...state.game.players];
      state.selectedPadUuid = firstPadUUID;
      state.suggestions = [];
    },
    addVoteToPadStep: (state, action: PayloadAction<{ padStepId: string; playerId: string }>) => {
      if (!state.game) return;
      const { playerId, padStepId } = action.payload;

      state.game.pads.forEach((pad) =>
        pad.steps
          .filter((step) => step.uuid === padStepId)
          .forEach((padStep) => padStep.votes.push({ player_id: playerId })),
      );
    },
    removeVoteFromPadStep: (
      state,
      action: PayloadAction<{ padStepId: string; playerId: string }>,
    ) => {
      if (!state.game) return;
      const { playerId, padStepId } = action.payload;

      state.game.pads.forEach((pad) =>
        pad.steps
          .filter((step) => step.uuid === padStepId)
          .forEach((padStep) => {
            const firstVoteIndex = padStep.votes.findIndex((vote) => vote.player_id === playerId);
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
    setSelectedPadUuid: (state, action: PayloadAction<string>) => {
      state.selectedPadUuid = action.payload;
    },
    setSelectedPadFromEvents: (state, action: PayloadAction<{ pad: Pad }>) => {
      if (state.game?.phase === GamePhase.REVEAL) {
        state.selectedPadUuid = action.payload.pad.uuid;
      }
    },
    setWinners: (state, action: PayloadAction<PadStep[]>) => {
      state.winners = action.payload;
    },
    resetGameMetadata: (state) => {
      state.winners = null;
    },
    removeGame: (state) => {
      state.game = null;
      state.gameStructure = null;
      state.remainingPlayers = [];
      state.suggestions = [];
      state.recapViews = {};
      state.selectedPadUuid = null;
      state.winners = null;
    },
  },
});

export const {
  updateGame,
  startRound,
  markPlayerFinished,
  markPlayerNotFinished,
  setSuggestions,
  setPlayerViewingPad,
  setSelectedPadUuid,
  setSelectedPadFromEvents,
  setWinners,
  addVoteToPadStep,
  removeVoteFromPadStep,
  resetGameMetadata,
  removeGame,
} = gameSlice.actions;
export default gameSlice.reducer;
