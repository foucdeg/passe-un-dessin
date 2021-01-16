import client from 'services/networking/client';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { updateCurrentStreamsCount, updateCurrentStreams } from './slice';

export const useFetchCurrentStreamsCount = () => {
  const dispatch = useDispatch();

  return useCallback(async () => {
    const currentStreamsCount = await client.get(`/current-streams/count`);
    dispatch(updateCurrentStreamsCount(currentStreamsCount));
  }, [dispatch]);
};

export const useFetchCurrentStreams = () => {
  const dispatch = useDispatch();

  return useCallback(async () => {
    const streams = await client.get(`/current-streams`);
    dispatch(updateCurrentStreams(streams));
  }, [dispatch]);
};
