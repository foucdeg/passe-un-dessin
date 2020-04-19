import client from 'services/networking/client';
import { useDispatch } from 'react-redux';
import { updatePlayer } from './slice';
import { useCallback } from 'react';
import { Player } from './types';

export const useFetchMe = () => {
  const dispatch = useDispatch();

  return useCallback(async () => {
    try {
      const player = await client.get(`/player/me`);
      dispatch(updatePlayer(player));
    } catch (e) {
      if (e.status === 401) {
        return dispatch(updatePlayer(false));
      }
      throw e;
    }
  }, [dispatch]);
};

export const useCreatePlayer = () => {
  const dispatch = useDispatch();

  return useCallback(
    async (name: string) => {
      const player = await client.post(`/player`, { name });
      dispatch(updatePlayer(player));
    },
    [dispatch],
  );
};

export const useEditPlayer = () => {
  const dispatch = useDispatch();

  return useCallback(
    async (player: Player) => {
      const returnedPlayer = await client.put(`/player/${player.uuid}`, player);
      dispatch(updatePlayer(returnedPlayer));
    },
    [dispatch],
  );
};
