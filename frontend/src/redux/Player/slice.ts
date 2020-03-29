import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Player } from './types';

export type PlayerState = Readonly<{
  player: Player | null;
}>;

const initialState: PlayerState = { player: null } as PlayerState;

const playerSlice = createSlice({
  name: 'Player',
  initialState,
  reducers: {
    updatePlayer: (state, action: PayloadAction<Player | null>) => {
      state.player = action.payload;
    },
  },
});

export const { updatePlayer } = playerSlice.actions;
export default playerSlice.reducer;
