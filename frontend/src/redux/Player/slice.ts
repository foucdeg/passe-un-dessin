import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Player } from './types';

export type PlayerState = Readonly<{
  player: Player | null | false;
  totalScore: number | null;
}>;

const initialState: PlayerState = { player: null, totalScore: null } as PlayerState;

const playerSlice = createSlice({
  name: 'Player',
  initialState,
  reducers: {
    updatePlayer: (state, action: PayloadAction<Player | null | false>) => {
      state.player = action.payload;
    },
    updatePlayerTotalScore: (state, action: PayloadAction<number>) => {
      state.totalScore = action.payload;
    },
  },
});

export const { updatePlayer, updatePlayerTotalScore } = playerSlice.actions;
export default playerSlice.reducer;
