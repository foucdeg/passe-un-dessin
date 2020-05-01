import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Room, RoomRanking } from './types';
import { Player } from 'redux/Player/types';

export type RoomState = Readonly<{
  room: Room | null;
  ranking: RoomRanking | null;
}>;

const initialState: RoomState = { room: null, ranking: null } as RoomState;

const roomSlice = createSlice({
  name: 'Room',
  initialState: initialState,
  reducers: {
    updateRoom: (state, action: PayloadAction<Room | null>) => {
      state.room = action.payload;
    },
    joinRoom: (state, action: PayloadAction<Player>) => {
      if (!state.room?.players.some(roomPlayer => roomPlayer.uuid === action.payload.uuid)) {
        state.room?.players.push(action.payload);
      }
    },
    updateRanking: (state, action: PayloadAction<RoomRanking>) => {
      state.ranking = action.payload;
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
  joinRoom,
  addPlayerToRoom,
  removePlayerFromRoom,
  nameNewAdmin,
  updateRanking,
} = roomSlice.actions;
export default roomSlice.reducer;
