import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Game } from './types';

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
  },
});

export const { updateGame } = gameSlice.actions;
export default gameSlice.reducer;
