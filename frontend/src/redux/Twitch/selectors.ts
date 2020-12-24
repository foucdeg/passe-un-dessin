import { RootState } from 'redux/types';

export const selectCurrentStreamsCount = (state: RootState) => state.twitch.currentStreamsCount;
export const selectCurrentStreams = (state: RootState) => state.twitch.currentStreams;
