import { useAsyncFn } from 'react-use';
import client from 'services/networking/client';
import { useDispatch } from 'react-redux';
import { updateRoom } from './slice';
import { history } from 'redux/store';

export const useFetchRoom = () => {
  const dispatch = useDispatch();
  /* eslint-disable-next-line @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return useAsyncFn(async (roomId: string) => {
    const room = await client.get(`/room/${roomId}`);
    dispatch(updateRoom(room));
  });
};

export const useCreateRoom = () => {
  return useAsyncFn(async () => {
    const room = await client.post('/room', {});
    history.push(`/room/${room.uuid}`);
  });
};

export const useJoinRoom = () => {
  /* eslint-disable-next-line @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return useAsyncFn(async (roomId: string) => {
    await client.put(`/room/${roomId}/join`, {});
  });
};
