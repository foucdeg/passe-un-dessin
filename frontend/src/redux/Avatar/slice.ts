import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from './types';

export type AvatarState = Readonly<{
  userAvatarUrl: string | null;
  username: string | null;
}>;

const initialState: AvatarState = {
  userAvatarUrl: null,
  username: null,
};

const avatarSlice = createSlice({
  name: 'Avatar',
  initialState,
  reducers: {
    updateUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const avatarUrl = action.payload.avatar_url;
      state.userAvatarUrl = avatarUrl !== undefined ? avatarUrl : null;
    },
  },
});

export const { updateUsername, updateUser } = avatarSlice.actions;
export default avatarSlice.reducer;
