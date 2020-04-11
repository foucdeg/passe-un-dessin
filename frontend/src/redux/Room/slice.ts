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
    removePlayerFromRoom: (state, action: PayloadAction<Player>) => {
      if (!state.room) return;

      state.room.players = state.room.players.filter(
        roomPlayer => roomPlayer.uuid !== action.payload.uuid,
      );
    },
    nameNewAdmin: (state, action: PayloadAction<Player>) => {
      if (!state.room) return;

      state.room.admin = action.payload;
    },
  },
});

export const {
  updateRoom,
  addPlayerToRoom,
  removePlayerFromRoom,
  nameNewAdmin,
} = roomSlice.actions;
export default roomSlice.reducer;
