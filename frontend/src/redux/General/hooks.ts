import client from 'services/networking/client';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { updateLeaderboard } from './slice';

export const useFetchLeaderboard = () => {
  const dispatch = useDispatch();

  return useCallback(async () => {
    const { pageData: leaderboard } = await client.get(`/leaderboard`);
    dispatch(updateLeaderboard(leaderboard));
  }, [dispatch]);
};
