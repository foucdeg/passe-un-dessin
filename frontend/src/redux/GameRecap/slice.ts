import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type GameRecapState = Readonly<{
  recapDisplayedPadId: string | null;
}>;

const initialState: GameRecapState = {
  recapDisplayedPadId: null,
} as GameRecapState;

const gameSlice = createSlice({
  name: 'GameRecao',
  initialState,
  reducers: {
    setDisplayedPadId: (state, action: PayloadAction<string>) => {
      state.recapDisplayedPadId = action.payload;
    },
  },
});

export const { setDisplayedPadId } = gameSlice.actions;
export default gameSlice.reducer;
