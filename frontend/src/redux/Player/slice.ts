import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Player, PlayerWithParticipations } from './types';

export type PlayerState = Readonly<{
  current: {
    player: Player | null | false;
  };
  displayed: {
    player: null | PlayerWithParticipations;
  };
}>;

const initialState: PlayerState = {
  current: {
    player: null,
  },
  displayed: {
    player: null,
  },
} as PlayerState;

const playerSlice = createSlice({
  name: 'Player',
  initialState,
  reducers: {
    updatePlayer: (state, action: PayloadAction<Player | null | false>) => {
      state.current.player = action.payload;
    },
    updateDisplayedPlayer: (state, action: PayloadAction<PlayerWithParticipations | null>) => {
      state.displayed.player = action.payload;
    },
  },
});

export const { updatePlayer, updateDisplayedPlayer } = playerSlice.actions;
export default playerSlice.reducer;
