import { useAsyncFn } from 'react-use';
import client from 'services/networking/client';
import { useDispatch } from 'react-redux';
import { updateGame } from './slice';
import { push } from 'connected-react-router';

export const useFetchGame = () => {
  const dispatch = useDispatch();
  /* eslint-disable-next-line @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return useAsyncFn(async (gameId: string) => {
    const game = await client.get(`/game/${gameId}`);
    dispatch(updateGame(game));
  });
};

export const useStartGame = () => {
  const dispatch = useDispatch();
  /* eslint-disable-next-line @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return useAsyncFn(async (roomId: string) => {
    const { game_id: gameId } = await client.put(`/room/${roomId}/start`, {});
    dispatch(push(`/game/${gameId}`));
  });
};
