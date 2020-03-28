import { useAsyncFn } from 'react-use';
import { useHistory } from 'react-router';
import client from 'services/networking/client';
import { PATHS } from 'routes';
import { useDispatch } from 'react-redux';
import * as Sentry from '@sentry/browser';
import jwt_decode from 'jwt-decode';
import { FormValues } from 'src/pages/Login/service';
import { userLoggedIn } from './slice';

export const useLogout = () => {
  const { push } = useHistory();
  return useAsyncFn(async () => {
    await client.logout();
    push(PATHS.LOGIN);
  });
};

export const useLogin = () => {
  const { push } = useHistory();
  const dispatch = useDispatch();
  /* eslint-disable-next-line @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return useAsyncFn(async (payload: FormValues) => {
    const token: string | undefined = await client.login(payload);
    if (token) {
      dispatch(userLoggedIn(token));
      Sentry.configureScope(scope => {
        scope.setUser({
          email: payload.email,
          ...jwt_decode(token),
        });
      });
      push(PATHS.HOME);
    } else {
      throw new Error('No token in login response body');
    }
  });
};
