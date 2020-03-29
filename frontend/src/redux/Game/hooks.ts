import { useAsyncFn } from 'react-use';
import client from 'services/networking/client';
import { useDispatch } from 'react-redux';
import { updateGame } from './slice';

export const useFetchGame = () => {
  const dispatch = useDispatch();
  /* eslint-disable-next-line @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return useAsyncFn(async (gameId: string) => {
    const game = await client.get(`/games/${gameId}`);
    dispatch(updateGame(game));
  });
};
