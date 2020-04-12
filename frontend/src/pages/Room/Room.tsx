import React, { useEffect, lazy, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'redux/useSelector';

import { useFetchRoom, useLeaveRoom } from 'redux/Room/hooks';
import { useParams, Switch, Route, useRouteMatch, useHistory } from 'react-router';
import { SERVER_EVENT_TYPES, useServerSentEvent } from 'services/networking/server-events';
import { addPlayerToRoom, removePlayerFromRoom, nameNewAdmin } from 'redux/Room';
import { selectRoom } from 'redux/Room/selectors';

const Game = lazy(() => import('../../pages/Game'));
const RoomLobby = lazy(() => import('../../pages/RoomLobby'));

const Room: React.FunctionComponent = () => {
  const { roomId } = useParams();
  const doFetchRoom = useFetchRoom();
  const doLeaveRoom = useLeaveRoom();

  const room = useSelector(selectRoom);
  const { path } = useRouteMatch();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (roomId) {
      doFetchRoom(roomId);
    }
  }, [doFetchRoom, roomId]);

  const onRoomEvent = useCallback(
    ({ message_type: messageType, player, game }) => {
      switch (messageType) {
        case SERVER_EVENT_TYPES.PLAYER_CONNECTED:
          return dispatch(addPlayerToRoom(player));
        case SERVER_EVENT_TYPES.PLAYER_LEFT:
          return dispatch(removePlayerFromRoom(player));
        case SERVER_EVENT_TYPES.NEW_ADMIN:
          return dispatch(nameNewAdmin(player));

        case SERVER_EVENT_TYPES.GAME_STARTS:
          return history.push(`/room/${room?.uuid}/game/${game.uuid}`);
      }
    },
    [dispatch, history, room],
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

  if (!room) return null;

  return (
    <Switch>
      <Route path={`${path}/game/:gameId`} component={Game} />
      <Route path={`${path}`} exact component={RoomLobby} />
    </Switch>
  );
};

export default Room;
