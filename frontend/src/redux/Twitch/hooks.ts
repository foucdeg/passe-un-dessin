import client from 'services/networking/client';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { updateCurrentStreamsCount, updateCurrentStreams } from './slice';

export const useFetchCurrentStreamsCount = () => {
  const dispatch = useDispatch();

  return useCallback(async () => {
    const response = await client.get(`/current-streams/count`);
    dispatch(updateCurrentStreamsCount(response['current_streams_count']));
  }, [dispatch]);
};

export const useFetchCurrentStreams = () => {
  const dispatch = useDispatch();

  return useCallback(async () => {
    const response = await client.get(`/current-streams`);
    dispatch(updateCurrentStreams(response['streams']));
  }, [dispatch]);
};
