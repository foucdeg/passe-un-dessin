import { RootState } from 'redux/types';

export const selectRoom = (state: RootState) => state.room.room;
