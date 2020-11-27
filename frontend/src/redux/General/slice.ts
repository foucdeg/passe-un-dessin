import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Leaderboard, LeaderboardResponse } from './types';

export type GeneralState = Readonly<{
  leaderboard: Leaderboard;
}>;

const initialState: GeneralState = { leaderboard: [] };

const generalSlice = createSlice({
  name: 'General',
  initialState,
  reducers: {
    updateLeaderboard: (state, action: PayloadAction<LeaderboardResponse>) => {
      if (state.leaderboard.length >= action.payload.pageNumber * 10) return;
      state.leaderboard = state.leaderboard.concat(action.payload.pageData);
    },
  },
});

export const { updateLeaderboard } = generalSlice.actions;
export default generalSlice.reducer;
