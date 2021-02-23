import client from 'services/networking/client';
import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useAsyncFn } from 'react-use';
import { updateLeaderboard } from './slice';

export const useFetchLeaderboard = () => {
  const dispatch = useDispatch();

  return useCallback(
    async (page: number, filter: string, shouldResetState?: boolean) => {
      const response = await client.get(`/leaderboard?page=${page}&filter=${filter}`);
      dispatch(updateLeaderboard({ leaderboard: response, shouldResetState }));
    },
    [dispatch],
  );
};

export const useUnauthenticatedGuard = () => {
  const { push } = useHistory();

  useEffect(() => {
    async function checkMe() {
      const me = await client.get(`/player/me`);
      if (me && me.user) {
        console.warn(
          'Redirecting to homepage as this page should not be accessed by an authenticated user',
        );
        push('/');
      }
    }
    checkMe();
  }, [push]);
};

export const useSendDesktopEmail = () => {
  return useAsyncFn(async (email: string) => {
    return await client.post('/desktop-email', { email });
  });
};
