import React, { useEffect, lazy, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, Switch, Route, useRouteMatch, useHistory } from 'react-router';

import { useSelector } from 'redux/useSelector';
import { addPlayerToRoom, removePlayerFromRoom, nameNewAdmin } from 'redux/Room';
import { selectRoom } from 'redux/Room/selectors';
import { useFetchRoom, useGetRanking } from 'redux/Room/hooks';
import { Player } from 'redux/Player/types';

import { SERVER_EVENT_TYPES, useServerSentEvent } from 'services/networking/server-events';
import { selectGame } from 'redux/Game/selectors';
import { GamePhase } from 'redux/Game/types';
import { resetGameMetadata } from 'redux/Game/slice';

import { selectPlayer } from 'redux/Player/selectors';
import LostPlayerModal from 'modals/LostPlayerModal';

const Game = lazy(() => import('../../pages/Game'));
const RoomLobby = lazy(() => import('../../pages/RoomLobby'));

const Room: React.FunctionComponent = () => {
  const { roomId } = useParams();
  const doFetchRoom = useFetchRoom();
  const [playerWhoLeft, setPlayerWhoLeft] = useState<Player | null>(null);
  const [adminChanged, setAdminChanged] = useState<boolean>(false);

  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const player = useSelector(selectPlayer);
  const doGetRanking = useGetRanking();

  const { path } = useRouteMatch();
  const dispatch = useDispatch();
  const { push } = useHistory();

  useEffect(() => {
    if (roomId) {
      doFetchRoom(roomId);
    }
  }, [doFetchRoom, roomId]);

  const onRoomEvent = useCallback(
    ({ message_type: messageType, player: messagePlayer, game, needs_new_admin: adminChanged }) => {
      switch (messageType) {
        case SERVER_EVENT_TYPES.PLAYER_CONNECTED:
          return dispatch(addPlayerToRoom(messagePlayer));
        case SERVER_EVENT_TYPES.PLAYER_LEFT:
          if (player && messagePlayer.uuid === player.uuid) {
            return push('/');
          }
          setPlayerWhoLeft(messagePlayer);
          setAdminChanged(adminChanged);
          return dispatch(removePlayerFromRoom(messagePlayer));
        case SERVER_EVENT_TYPES.NEW_ADMIN:
          return dispatch(nameNewAdmin(messagePlayer));

        case SERVER_EVENT_TYPES.GAME_STARTS:
          dispatch(resetGameMetadata());

          return push(`/room/${roomId}/game/${game.uuid}`);
      }
    },
    [dispatch, push, player, roomId],
  );

  const channelName = room ? `room-${room.uuid}` : null;

  useServerSentEvent(channelName, onRoomEvent);

  useEffect(() => {
    setPlayerWhoLeft(null);
    setAdminChanged(false);
  }, [game]);

  const gameId = game?.uuid;

  useEffect(() => {
    if (room && gameId) {
      doGetRanking(room.uuid);
    }
  }, [doGetRanking, room, gameId]);

  if (!room) return null;

  const shouldShowPlayerLeftModal =
    playerWhoLeft &&
    game &&
    ![GamePhase.DEBRIEF, GamePhase.VOTE_RESULTS].includes(game.phase) &&
    game.players.map((gamePlayer) => gamePlayer.uuid).includes(playerWhoLeft.uuid);

  return (
    <>
      <Switch>
        <Route path={`${path}/game/:gameId`} component={Game} />
        <Route path={`${path}`} exact component={RoomLobby} />
      </Switch>
      {shouldShowPlayerLeftModal && playerWhoLeft && (
        <LostPlayerModal adminChanged={adminChanged} playerWhoLeft={playerWhoLeft} />
      )}
    </>
  );
};

export default Room;
