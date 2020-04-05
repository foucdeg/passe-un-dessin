import { useAsyncFn } from 'react-use';
import client from 'services/networking/client';
import { useDispatch } from 'react-redux';
import { updateGame, updatePad } from './slice';
import { Pad } from './types';
import { History } from 'history';

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
  return useAsyncFn(
    /* eslint-disable-next-line @typescript-eslint/ban-ts-ignore */
    // @ts-ignore
    async (
      roomId: string,
      history: History<History.PoorMansUnknown>,
      playersOrder?: string[] | null,
    ) => {
      const { game_id: gameId } = await client.put(`/room/${roomId}/start`, {
        playersOrder,
      });
      history.push(`/room/${roomId}/game/${gameId}`);
    },
  );
};

export const useSavePad = () => {
  const dispatch = useDispatch();
  /* eslint-disable-next-line @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return useAsyncFn(async (pad: Pad, sentence: string) => {
    const updatedPad = await client.put(`/pad/${pad.uuid}/save`, { sentence });
    dispatch(updatePad(updatedPad));
  });
};
