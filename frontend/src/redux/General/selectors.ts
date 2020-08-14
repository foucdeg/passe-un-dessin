import { RootState } from 'redux/types';

export const selectLeaderboard = (state: RootState) => state.general.leaderboard;
