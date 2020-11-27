import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PadStep } from 'redux/Game/types';

export type StepState = Readonly<{
  step: PadStep | null;
}>;

const initialState: StepState = { step: null } as StepState;

const stepSlice = createSlice({
  name: 'Step',
  initialState: initialState,
  reducers: {
    updateStep: (state, action: PayloadAction<PadStep | null>) => {
      state.step = action.payload;
    },
    resetStep: (state) => {
      state.step = null;
    },
  },
});

export const { updateStep, resetStep } = stepSlice.actions;
export default stepSlice.reducer;
