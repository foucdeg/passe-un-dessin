import { AvatarState } from './Avatar';
import { LoginState } from './Login';

export type RootState = Readonly<{
  avatar: AvatarState;
  login: LoginState;
}>;
