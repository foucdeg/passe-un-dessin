import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Game, Pad, GamePhase } from './types';

export type GameState = Readonly<{
  game: Game | null;
}>;

const initialState: GameState = { game: null } as GameState;

const gameSlice = createSlice({
  name: 'Game',
  initialState,
  reducers: {
    updateGame: (state, action: PayloadAction<Game | null>) => {
      state.game = action.payload;
    },
    updatePad: (state, action: PayloadAction<Pad>) => {
      if (!state.game) return;

      const matchingPadIndex = state.game?.pads.findIndex(pad => pad.uuid === action.payload.uuid);

      state.game.pads[matchingPadIndex] = action.payload;
    },
    startRounds: (state, action: PayloadAction<{}>) => {
      if (!state.game) return;

      state.game.phase = GamePhase.ROUNDS;
      state.game.current_round = 0;
    },
  },
});

export const { updateGame, updatePad, startRounds } = gameSlice.actions;
export default gameSlice.reducer;
