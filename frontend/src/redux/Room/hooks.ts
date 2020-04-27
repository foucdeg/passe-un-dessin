import client from 'services/networking/client';
import { useDispatch } from 'react-redux';
import { updateRoom, updateRanking } from './slice';
import { useHistory } from 'react-router';
import { Room } from './types';
import { useCallback } from 'react';
import { Player } from 'redux/Player/types';

export const useFetchRoom = () => {
  const dispatch = useDispatch();

  return useCallback(
    async (roomId: string) => {
      const room = await client.get(`/room/${roomId}`);
      dispatch(updateRoom(room));
    },
    [dispatch],
  );
};

export const useGetRanking = () => {
  const dispatch = useDispatch();

  return useCallback(
    async (roomId: string) => {
      const response = await client.get(`/room/${roomId}/ranking`);
      dispatch(updateRanking(response['ranking']));
    },
    [dispatch],
  );
};

export const useCreateRoom = () => {
  const history = useHistory();

  return useCallback(async () => {
    const room = await client.post('/room', {});
    history.push(`/room/${room.uuid}`);
  }, [history]);
};

export const useJoinRoom = () => {
  return useCallback(async (roomId: string) => {
    await client.put(`/room/${roomId}/join`, {});
  }, []);
};

export const useLeaveRoom = () => {
  return useCallback(async (room: Room) => {
    await client.put(`/room/${room.uuid}/leave`, {});
  }, []);
};

export const useRemovePlayer = () => {
  return useCallback(async (room: Room, player: Player) => {
    await client.put(`/room/${room.uuid}/kick`, { playerId: player.uuid });
  }, []);
};
