import { RootState } from 'redux/types';

export const selectStep = (state: RootState) => state.step.step;
