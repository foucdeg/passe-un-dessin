import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Game } from './types';

export type GameState = Readonly<Game | null>;

const initialState: GameState = null as GameState;

const roomSlice = createSlice({
  name: 'Game',
  initialState,
  reducers: {
    updateGame: (state: GameState, action: PayloadAction<Game | null>) => {
      state = action.payload;
    },
  },
});

export const { updateGame } = roomSlice.actions;
export default roomSlice.reducer;
