import client from 'services/networking/client';
import { useDispatch } from 'react-redux';
import { updatePlayer } from './slice';
import { useCallback } from 'react';
import { Player } from './types';
import { useTypedAsyncFn } from 'services/utils';

export const AUTH_ERROR_EMAIL_IN_USE = 'AUTH_ERROR_EMAIL_IN_USE';
export const AUTH_ERROR_INVALID_USERNAME_PASSWORD = 'AUTH_ERROR_INVALID_USERNAME_PASSWORD';

export enum AuthProvider {
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK',
  CLASSIC = 'CLASSIC',
}

export const useFetchMe = () => {
  const dispatch = useDispatch();

  return useCallback(async () => {
    try {
      const player = await client.get(`/player/me`);
      dispatch(updatePlayer(player));
    } catch (e) {
      if (e.status === 401) {
        return dispatch(updatePlayer(false));
      }
      throw e;
    }
  }, [dispatch]);
};

export const useCreatePlayer = () => {
  const dispatch = useDispatch();

  return useCallback(
    async (name: string) => {
      const player = await client.post(`/player`, { name });
      dispatch(updatePlayer(player));
    },
    [dispatch],
  );
};

export const useEditPlayer = () => {
  const dispatch = useDispatch();

  return useCallback(
    async (player: Player) => {
      const returnedPlayer = await client.put(`/player/${player.uuid}`, { ...player });
      dispatch(updatePlayer(returnedPlayer));
    },
    [dispatch],
  );
};

export const useSocialLogin = () => {
  const doFetchMe = useFetchMe();

  return useCallback(
    async (token: string, provider: AuthProvider) => {
      await client.post(`/auth/social-login`, { token, provider });
      await doFetchMe();
    },
    [doFetchMe],
  );
};

export const useLogin = () => {
  const doFetchMe = useFetchMe();

  return useTypedAsyncFn<{ email: string; password: string }>(
    async ({ email, password }) => {
      try {
        await client.post(`/auth/login`, { email, password });
        await doFetchMe();
      } catch (e) {
        if (e.status === 401) {
          throw new Error(AUTH_ERROR_INVALID_USERNAME_PASSWORD);
        }
        throw e;
      }
    },
    [doFetchMe],
  );
};

export const useCreateAccount = () => {
  const doFetchMe = useFetchMe();

  return useTypedAsyncFn<{ email: string; password: string }>(
    async ({ email, password }) => {
      try {
        await client.post(`/auth/create-account`, { email, password });
        await doFetchMe();
      } catch (e) {
        if (e.status === 400) {
          throw new Error(AUTH_ERROR_EMAIL_IN_USE);
        }
        throw e;
      }
    },
    [doFetchMe],
  );
};
