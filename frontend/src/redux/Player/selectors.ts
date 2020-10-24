import { RootState } from 'redux/types';

export const selectPlayer = (state: RootState) => state.player.current.player;
export const selectPlayerTotalScore = (state: RootState) => state.player.current.totalScore;
export const selectPlayerRanking = (state: RootState) => state.player.current.ranking;
export const selectDisplayedPlayer = (state: RootState) => state.player.displayed.player;
export const selectDisplayedPlayerTotalScore = (state: RootState) =>
  state.player.displayed.totalScore;
export const selectDisplayedPlayerRanking = (state: RootState) => state.player.displayed.ranking;
