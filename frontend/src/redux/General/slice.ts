import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Leaderboard } from './types';

export type GeneralState = Readonly<{
  leaderboard: Leaderboard | null;
}>;

const initialState: GeneralState = { leaderboard: null };

const generalSlice = createSlice({
  name: 'General',
  initialState,
  reducers: {
    updateLeaderboard: (state, action: PayloadAction<Leaderboard | null>) => {
      state.leaderboard = action.payload;
    },
  },
});

export const { updateLeaderboard } = generalSlice.actions;
export default generalSlice.reducer;
