import { RootState } from 'redux/types';

export const selectPlayer = (state: RootState) => state.player.player;
export const selectPlayerTotalScore = (state: RootState) => state.player.totalScore;
