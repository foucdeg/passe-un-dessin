import client from 'services/networking/client';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { updateLeaderboard } from './slice';

export const useFetchLeaderboard = () => {
  const dispatch = useDispatch();

  return useCallback(
    async (page: number) => {
      const response = await client.get(`/leaderboard?page=${page}`);
      dispatch(updateLeaderboard(response));
    },
    [dispatch],
  );
};
