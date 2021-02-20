import { RootState } from 'redux/types';

export const selectPlayer = (state: RootState) => state.player.current.player;
export const selectDisplayedPlayer = (state: RootState) => state.player.displayed.player;
export const selectPlayerId = (state: RootState) =>
  state.player.current.player ? state.player.current.player.uuid : state.player.current.player;
