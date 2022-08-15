import client from 'services/networking/client';
import { useAsyncFn } from 'react-use';
import { Stream } from './types';

export const useCurrentStreamCount = () => {
  return useAsyncFn(async () => {
    const currentStreamsCount: number = await client.get(`/current-streams/count`);
    return currentStreamsCount;
  }, []);
};

export const useCurrentStreams = () => {
  return useAsyncFn(async () => {
    const streams: Stream[] = await client.get(`/current-streams`);
    return streams;
  }, []);
};
