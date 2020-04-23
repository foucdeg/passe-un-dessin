import { RootState } from 'redux/types';

export const selectRecapDisplayedTabId = (state: RootState) => state.gameRecap.recapDisplayedPadId;
