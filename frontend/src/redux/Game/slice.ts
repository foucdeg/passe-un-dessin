import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Game, Pad, GamePhase } from './types';
import { Player } from 'redux/Player/types';

export type GameState = Readonly<{
  game: Game | null;
  remainingPlayers: Player[];
  suggestions: string[];
  recapViews: { [padUuid: string]: Player[] };
}>;

const initialState: GameState = {
  game: null,
  remainingPlayers: [],
  suggestions: [],
  recapViews: {},
} as GameState;

const gameSlice = createSlice({
  name: 'Game',
  initialState,
  reducers: {
    updateGame: (state, action: PayloadAction<Game | null>) => {
      state.game = action.payload;
      if (!state.game) return;

      state.remainingPlayers = state.game.players || [];
      state.recapViews =
        state.game?.pads.reduce(
          (acc, pad) => ({ ...acc, [pad.uuid]: [] }),
          {} as { [padUuid: string]: Player[] },
        ) || {};

      const firstPadUUID = state.game.pads[0].uuid;
      state.recapViews[firstPadUUID] = [...state.game.players];
    },
    updatePad: (state, action: PayloadAction<Pad>) => {
      if (!state.game) return;

      const matchingPadIndex = state.game?.pads.findIndex(pad => pad.uuid === action.payload.uuid);

      state.game.pads[matchingPadIndex] = action.payload;
    },
    startRound: (state, action: PayloadAction<{ roundNumber?: number }>) => {
      if (!state.game) return;

      state.game.phase = GamePhase.ROUNDS;
      state.game.current_round = action.payload.roundNumber || 0;
      state.remainingPlayers = state.game.players;
    },
    markPlayerFinished: (state, action: PayloadAction<Player>) => {
      state.remainingPlayers = state.remainingPlayers.filter(
        remPlayer => remPlayer.uuid !== action.payload.uuid,
      );
    },
    setSuggestions: (state, action: PayloadAction<string[]>) => {
      state.suggestions = action.payload;
    },
    setPlayerViewingPad: (state, action: PayloadAction<{ player: Player; pad: Pad }>) => {
      for (const padId in state.recapViews) {
        state.recapViews[padId] = state.recapViews[padId].filter(
          viewer => viewer.uuid !== action.payload.player.uuid,
        );
      }
      state.recapViews[action.payload.pad.uuid].push(action.payload.player);
    },
  },
});

export const {
  updateGame,
  updatePad,
  startRound,
  markPlayerFinished,
  setSuggestions,
  setPlayerViewingPad,
} = gameSlice.actions;
export default gameSlice.reducer;
