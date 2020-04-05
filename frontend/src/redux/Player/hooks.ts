import { useAsyncFn } from 'react-use';
import client from 'services/networking/client';
import { useDispatch } from 'react-redux';
import { updatePlayer } from './slice';

export const useFetchMe = () => {
  const dispatch = useDispatch();
  return useAsyncFn(async () => {
    try {
      const player = await client.get(`/player/me`);
      dispatch(updatePlayer(player));
    } catch (e) {
      if (e.status === 401) {
        return dispatch(updatePlayer(false));
      }
      throw e;
    }
  });
};

export const useCreatePlayer = () => {
  const dispatch = useDispatch();
  /* eslint-disable-next-line @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return useAsyncFn(async (name: string) => {
    const player = await client.post(`/player`, { name });
    dispatch(updatePlayer(player));
  });
};
