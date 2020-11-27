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
    updateLeaderboard: (state, action: PayloadAction<LeaderboardResponse>) => {
      action.payload.pageData.forEach((player, index) => {
        state.leaderboard[(action.payload.pageNumber - 1) * 10 + index + 1] = player;
      });
    },
  },
});

export const { updateLeaderboard } = generalSlice.actions;
export default generalSlice.reducer;
