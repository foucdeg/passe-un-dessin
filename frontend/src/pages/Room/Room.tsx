import React, { useEffect, lazy, useCallback } from 'react';
import { RootState } from 'redux/types';
import { useSelector, useDispatch } from 'react-redux';
import { useFetchRoom } from 'redux/Room/hooks';
import { useParams, Switch, Route, useRouteMatch, useHistory } from 'react-router';
import { SERVER_EVENT_TYPES, useServerSentEvent } from 'services/networking/server-events';
import { addPlayerToRoom } from 'redux/Room';

const Game = lazy(() => import('../../pages/Game'));
const RoomLobby = lazy(() => import('../../pages/RoomLobby'));

const Room: React.FunctionComponent = () => {
  const { roomId } = useParams();
  const [, doFetchRoom] = useFetchRoom();
  const room = useSelector((state: RootState) => state.room.room);
  const { path } = useRouteMatch();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    doFetchRoom(roomId);
  }, [doFetchRoom, roomId]);

  const onRoomEvent = useCallback(
    ({ message_type: messageType, player, game }) => {
      switch (messageType) {
        case SERVER_EVENT_TYPES.PLAYER_CONNECTED:
          return dispatch(addPlayerToRoom(player));

        case SERVER_EVENT_TYPES.GAME_STARTS:
          return history.push(`/room/${room?.uuid}/game/${game.uuid}`);
      }
    },
    [dispatch, history, room],
  );

  useServerSentEvent(`room-${room?.uuid}`, onRoomEvent);

  if (!room) return null;

  return (
    <Switch>
      <Route path={`${path}/game/:gameId`} component={Game} />
      <Route path={`${path}`} exact component={RoomLobby} />
    </Switch>
  );
};

export default Room;
