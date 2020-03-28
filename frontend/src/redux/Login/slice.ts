import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type LoginState = Readonly<{
  token: string | null;
}>;

const initialState: LoginState = { token: null };

const avatarSlice = createSlice({
  name: 'Login',
  initialState,
  reducers: {
    userLoggedIn: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    userLoggedOut: () => initialState,
  },
});

export const { userLoggedIn, userLoggedOut } = avatarSlice.actions;
export default avatarSlice.reducer;
