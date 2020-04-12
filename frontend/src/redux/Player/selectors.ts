import { RootState } from 'redux/types';

export const selectPlayer = (state: RootState) => state.player.player;
