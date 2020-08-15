import client from 'services/networking/client';
import { useDispatch } from 'react-redux';
import { updateLeaderboard } from './slice';
import { useCallback } from 'react';

export const useFetchLeaderboard = () => {
  const dispatch = useDispatch();

  return useCallback(async () => {
    const { pageData: leaderboard } = await client.get(`/leaderboard`);
    dispatch(updateLeaderboard(leaderboard));
  }, [dispatch]);
};
