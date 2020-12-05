import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LeaderboardPlayer, LeaderboardResponse } from './types';

export type GeneralState = Readonly<{
  leaderboard: { [rank: number]: LeaderboardPlayer };
}>;

const initialState: GeneralState = { leaderboard: [] };

const generalSlice = createSlice({
  name: 'General',
  initialState,
  reducers: {
    updateLeaderboard: (
      state,
      action: PayloadAction<{ leaderboard: LeaderboardResponse; shouldResetState?: boolean }>,
    ) => {
      if (action.payload.shouldResetState) {
        state.leaderboard = {};
      }
      action.payload.leaderboard.pageData.forEach((player, index) => {
        state.leaderboard[(action.payload.leaderboard.pageNumber - 1) * 10 + index + 1] = player;
      });
    },
  },
});

export const { updateLeaderboard } = generalSlice.actions;
export default generalSlice.reducer;
