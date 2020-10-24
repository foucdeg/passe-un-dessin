import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Player, PlayerWithParticipations } from './types';

export type PlayerState = Readonly<{
  current: {
    player: Player | null | false;
    totalScore: number | null;
    ranking: number | null;
  };
  displayed: {
    player: null | PlayerWithParticipations;
    totalScore: number | null;
    ranking: number | null;
  };
}>;

const initialState: PlayerState = {
  current: {
    player: null,
    totalScore: null,
    ranking: null,
  },
  displayed: {
    player: null,
    totalScore: null,
    ranking: null,
  },
} as PlayerState;

const playerSlice = createSlice({
  name: 'Player',
  initialState,
  reducers: {
    updatePlayer: (state, action: PayloadAction<Player | null | false>) => {
      state.current.player = action.payload;
    },
    updatePlayerTotalScore: (state, action: PayloadAction<{ score: number; ranking: number }>) => {
      state.current.totalScore = action.payload.score;
      state.current.ranking = action.payload.ranking;
    },
    updateDisplayedPlayer: (state, action: PayloadAction<PlayerWithParticipations | null>) => {
      state.displayed.player = action.payload;
      state.displayed.totalScore = null;
      state.displayed.ranking = null;
    },
    updateDisplayedPlayerTotalScore: (
      state,
      action: PayloadAction<{ score: number; ranking: number }>,
    ) => {
      state.displayed.totalScore = action.payload.score;
      state.displayed.ranking = action.payload.ranking;
    },
  },
});

export const {
  updatePlayer,
  updatePlayerTotalScore,
  updateDisplayedPlayer,
  updateDisplayedPlayerTotalScore,
} = playerSlice.actions;
export default playerSlice.reducer;
