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
  },
});

export const { updateStep } = stepSlice.actions;
export default stepSlice.reducer;
