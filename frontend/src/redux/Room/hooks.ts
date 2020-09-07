import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { selectPlayer } from 'redux/Player/selectors';
import { Player } from 'redux/Player/types';
import { useSelector } from 'redux/useSelector';
import client from 'services/networking/client';
import { joinRoom, removeRoom, updateRanking, updateRoom } from './slice';
import { Room } from './types';
import { selectGame } from 'redux/Game/selectors';
import { selectRoom } from './selectors';
import { GamePhase } from 'redux/Game/types';
import { useIntl } from 'react-intl';

export const useFetchRoom = () => {
  const dispatch = useDispatch();

  return useCallback(
    async (roomId: string) => {
      dispatch(updateRoom(null));
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
    const gtag = (window as any).gtag; // eslint-disable-line @typescript-eslint/no-explicit-any
    gtag('event', 'create_room', {
      event_category: 'engagement',
    });
    history.push(`/room/${room.uuid}`);
  }, [history]);
};

export const useJoinRoom = () => {
  const dispatch = useDispatch();
  const player = useSelector(selectPlayer);

  return useCallback(
    async (roomId: string) => {
      if (!player) return;

      await client.put(`/room/${roomId}/join`, {});
      dispatch(joinRoom(player));
    },
    [dispatch, player],
  );
};

export const useLeaveRoom = () => {
  const dispatch = useDispatch();
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const intl = useIntl();
  const history = useHistory();

  return useCallback(async () => {
    if (!room) return;
    const isOkayToLeave = !game || [GamePhase.DEBRIEF, GamePhase.VOTE_RESULTS].includes(game.phase);

    if (isOkayToLeave || window.confirm(intl.formatMessage({ id: 'menu.confirmLeave' }))) {
      await client.put(`/room/${room.uuid}/leave`, {});
      dispatch(removeRoom());
      history.push('/');
    }
  }, [dispatch, game, history, intl, room]);
};

export const useRemovePlayer = () => {
  return useCallback(async (room: Room, player: Player) => {
    await client.put(`/room/${room.uuid}/kick`, { playerId: player.uuid });
  }, []);
};
