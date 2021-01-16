import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Stream } from './types';

export type TwitchState = Readonly<{
  currentStreamsCount: number | null;
  currentStreams: Stream[] | null;
}>;

const initialState: TwitchState = {
  currentStreamsCount: null,
  currentStreams: null,
};

const twitchSlice = createSlice({
  name: 'Twitch',
  initialState,
  reducers: {
    updateCurrentStreamsCount: (state, action: PayloadAction<number>) => {
      state.currentStreamsCount = action.payload;
    },
    updateCurrentStreams: (state, action: PayloadAction<Stream[]>) => {
      state.currentStreams = action.payload;
    },
  },
});

export const { updateCurrentStreamsCount, updateCurrentStreams } = twitchSlice.actions;
export default twitchSlice.reducer;
