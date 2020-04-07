import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Game, Pad, GamePhase } from './types';
import { Player } from 'redux/Player/types';

export type GameState = Readonly<{
  game: Game | null;
  remainingPlayers: Player[];
}>;

const initialState: GameState = { game: null, remainingPlayers: [] } as GameState;

const gameSlice = createSlice({
  name: 'Game',
  initialState,
  reducers: {
    updateGame: (state, action: PayloadAction<Game | null>) => {
      state.game = action.payload;
      state.remainingPlayers = state.game?.players || [];
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
    startDebrief: (state, action: PayloadAction<{}>) => {
      if (!state.game) return;

      state.game.phase = GamePhase.DEBRIEF;
      state.game.current_round = null;
    },
    markPlayerFinished: (state, action: PayloadAction<Player>) => {
      state.remainingPlayers = state.remainingPlayers.filter(
        remPlayer => remPlayer.uuid !== action.payload.uuid,
      );
    },
  },
});

export const {
  updateGame,
  updatePad,
  startRound,
  startDebrief,
  markPlayerFinished,
} = gameSlice.actions;
export default gameSlice.reducer;
