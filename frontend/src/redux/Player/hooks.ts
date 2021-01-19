import client from 'services/networking/client';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { useSelector } from 'redux/useSelector';
import { useAsyncFn } from 'react-use';
import {
  updatePlayer,
  updatePlayerTotalScore,
  updateDisplayedPlayer,
  updateDisplayedPlayerTotalScore,
} from './slice';
import { Player } from './types';
import { selectPlayer } from './selectors';

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

export const useFetchPlayer = () => {
  const dispatch = useDispatch();

  return useAsyncFn(
    async (playerId: string) => {
      const player = await client.get(`/player/${playerId}`);
      dispatch(updateDisplayedPlayer(player));
    },
    [dispatch],
  );
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
  const doFetchMe = useFetchMe();

  return useCallback(
    async (player: Player) => {
      await client.put(`/player/${player.uuid}`, { ...player });
      await doFetchMe();
    },
    [doFetchMe],
  );
};

export const useSocialLogin = () => {
  const doFetchMe = useFetchMe();

  return useCallback(
    async (token: string, provider: AuthProvider) => {
      window.loginLock = true;
      const player = await client.post(`/auth/social-login`, { token, provider });

      if (window.gtag) {
        if (player._created) {
          window.gtag('event', 'sign_up', {
            method: provider,
          });
        } else {
          window.gtag('event', 'login', {
            method: provider,
          });
        }
      }

      await doFetchMe();
      window.loginLock = false;
    },
    [doFetchMe],
  );
};

export const useLogin = () => {
  const doFetchMe = useFetchMe();

  return useAsyncFn(
    async (email: string, password: string) => {
      window.loginLock = true;
      try {
        await client.post(`/auth/login`, { email, password });
        if (window.gtag) {
          window.gtag('event', 'login', {
            method: 'form',
          });
        }
        await doFetchMe();
      } catch (e) {
        if (e.status === 403) {
          throw new Error(AUTH_ERROR_INVALID_USERNAME_PASSWORD);
        }
        throw e;
      } finally {
        window.loginLock = false;
      }
    },
    [doFetchMe],
  );
};

export const useLogout = () => {
  const doFetchMe = useFetchMe();

  return useCallback(async () => {
    await client.post(`/auth/logout`);

    const FB = window.FB;
    if (!FB) return;
    FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        FB.logout();
      }
    });

    const authInstance = window.authInstance;
    if (authInstance) {
      authInstance.signOut();
    }

    await doFetchMe();
  }, [doFetchMe]);
};

export const useCreateAccount = () => {
  const doFetchMe = useFetchMe();

  return useAsyncFn(
    async (email: string, password: string) => {
      window.loginLock = true;
      try {
        await client.post(`/auth/create-account`, { email, password });
        if (window.gtag) {
          window.gtag('event', 'sign_up', {
            method: 'form',
          });
        }
        await doFetchMe();
      } catch (e) {
        if (e.status === 400) {
          throw new Error(AUTH_ERROR_EMAIL_IN_USE);
        }
        throw e;
      } finally {
        window.loginLock = false;
      }
    },
    [doFetchMe],
  );
};

export const useFetchPlayerTotalScore = () => {
  const dispatch = useDispatch();

  return useAsyncFn(
    async (playerId: string) => {
      const result = await client.get(`/player/${playerId}/total-score`);
      const { score, ranking } = result;
      dispatch(updateDisplayedPlayerTotalScore({ score, ranking }));
    },
    [dispatch],
  );
};

export const useFetchMyTotalScore = () => {
  const dispatch = useDispatch();
  const player = useSelector(selectPlayer);

  return useAsyncFn(async () => {
    if (!player) return;
    const result = await client.get(`/player/${player.uuid}/total-score`);
    const { score, ranking } = result;
    dispatch(updatePlayerTotalScore({ score, ranking }));
  }, [dispatch, player]);
};
