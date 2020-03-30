import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Room } from './types';
import { Player } from 'redux/Player/types';

export type RoomState = Readonly<{
  room: Room | null;
}>;

const initialState: RoomState = { room: null } as RoomState;

const roomSlice = createSlice({
  name: 'Room',
  initialState: initialState,
  reducers: {
    updateRoom: (state, action: PayloadAction<Room | null>) => {
      state.room = action.payload;
    },
    addPlayerToRoom: (state, action: PayloadAction<Player>) => {
      state.room?.players.push(action.payload);
    },
  },
});

export const { updateRoom, addPlayerToRoom } = roomSlice.actions;
export default roomSlice.reducer;
