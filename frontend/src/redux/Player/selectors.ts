import { RootState } from 'redux/types';

export const selectPlayer = (state: RootState) => state.player.player;
export const selectPlayerId = (state: RootState) =>
  state.player.player ? state.player.player.uuid : state.player.player;
