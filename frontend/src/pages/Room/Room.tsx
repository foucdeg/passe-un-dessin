import React, { useEffect, lazy, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, Switch, Route, useRouteMatch, useHistory } from 'react-router';

import { useSelector } from 'redux/useSelector';
import { addPlayerToRoom, removePlayerFromRoom, nameNewAdmin } from 'redux/Room';
import { selectRoom, selectPlayerIsAdmin } from 'redux/Room/selectors';
import { useFetchRoom, useLeaveRoom } from 'redux/Room/hooks';
import { Player } from 'redux/Player/types';

import { SERVER_EVENT_TYPES, useServerSentEvent } from 'services/networking/server-events';
import { selectGame } from 'redux/Game/selectors';
import { GamePhase } from 'redux/Game/types';
import { resetGameMetadata } from 'redux/Game/slice';

import { selectPlayer } from 'redux/Player/selectors';
import LostPlayerModal from 'components/LostPlayerModal';

const Game = lazy(() => import('../../pages/Game'));
const RoomLobby = lazy(() => import('../../pages/RoomLobby'));

const Room: React.FunctionComponent = () => {
  const { roomId } = useParams();
  const doFetchRoom = useFetchRoom();
  const doLeaveRoom = useLeaveRoom();
  const [playerWhoLeft, setPlayerWhoLeft] = useState<Player | null>(null);

  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const player = useSelector(selectPlayer);
  const isPlayerAdmin = useSelector(selectPlayerIsAdmin);

  const { path } = useRouteMatch();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (roomId) {
      doFetchRoom(roomId);
    }
  }, [doFetchRoom, roomId]);

  const onRoomEvent = useCallback(
    ({ message_type: messageType, player: messagePlayer, game }) => {
      switch (messageType) {
        case SERVER_EVENT_TYPES.PLAYER_CONNECTED:
          return dispatch(addPlayerToRoom(messagePlayer));
        case SERVER_EVENT_TYPES.PLAYER_LEFT:
          if (player && messagePlayer.uuid === player.uuid) {
            return history.push('/');
          }
          setPlayerWhoLeft(messagePlayer);
          return dispatch(removePlayerFromRoom(messagePlayer));
        case SERVER_EVENT_TYPES.NEW_ADMIN:
          return dispatch(nameNewAdmin(messagePlayer));

        case SERVER_EVENT_TYPES.GAME_STARTS:
          dispatch(resetGameMetadata());

          return history.push(`/room/${room?.uuid}/game/${game.uuid}`);
      }
    },
    [dispatch, history, player, room],
  );

  const channelName = room ? `room-${room.uuid}` : null;

  useServerSentEvent(channelName, onRoomEvent);

  const roomLeaveListener = useCallback(() => {
    if (room) {
      doLeaveRoom(room);
    }
  }, [doLeaveRoom, room]);

  useEffect(() => {
    window.addEventListener('unload', roomLeaveListener);

    return () => {
      window.removeEventListener('unload', roomLeaveListener);
    };
  }, [roomLeaveListener]);

  useEffect(() => setPlayerWhoLeft(null), [game]);

  if (!room) return null;

  const shouldShowPlayerLeftModal =
    playerWhoLeft &&
    game &&
    game?.phase !== GamePhase.DEBRIEF &&
    game.players.map(gamePlayer => gamePlayer.uuid).includes(playerWhoLeft.uuid);

  return (
    <>
      <Switch>
        <Route path={`${path}/game/:gameId`} component={Game} />
        <Route path={`${path}`} exact component={RoomLobby} />
      </Switch>
      {shouldShowPlayerLeftModal && playerWhoLeft && (
        <LostPlayerModal isAdmin={isPlayerAdmin} playerName={playerWhoLeft?.name} />
      )}
    </>
  );
};

export default Room;
