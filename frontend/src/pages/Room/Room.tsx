import React, { useEffect, lazy, useState } from 'react';
import { useParams, Routes, Route } from 'react-router';

import { useSelector } from 'redux/useSelector';
import { selectRoom } from 'redux/Room/selectors';
import { useFetchRoom, useGetRanking } from 'redux/Room/hooks';
import { Player } from 'redux/Player/types';

import { selectGame } from 'redux/Game/selectors';
import { GamePhase } from 'redux/Game/types';

import LostPlayerModal from 'modals/LostPlayerModal';
import { useRoomEvents } from './events';

const Game = lazy(() => import('pages/Game'));

interface RouteParams {
  roomId: string;
}

const Room: React.FunctionComponent = () => {
  const { roomId } = useParams<keyof RouteParams>() as RouteParams;
  const doFetchRoom = useFetchRoom();
  const [playerWhoLeft, setPlayerWhoLeft] = useState<Player | null>(null);
  const [adminChanged, setAdminChanged] = useState<boolean>(false);

  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const doGetRanking = useGetRanking();

  useEffect(() => {
    if (roomId) {
      doFetchRoom(roomId);
    }
  }, [doFetchRoom, roomId]);

  useEffect(() => {
    setPlayerWhoLeft(null);
    setAdminChanged(false);
  }, [game]);

  useRoomEvents(roomId, setPlayerWhoLeft, setAdminChanged);

  const gameId = game?.uuid;

  useEffect(() => {
    if (room && gameId) {
      doGetRanking(room.uuid);
    }
  }, [doGetRanking, room, gameId]);

  const shouldShowPlayerLeftModal =
    playerWhoLeft &&
    game &&
    ![GamePhase.REVEAL, GamePhase.DEBRIEF, GamePhase.VOTE_RESULTS].includes(game.phase) &&
    game.players.map((gamePlayer) => gamePlayer.uuid).includes(playerWhoLeft.uuid);

  if (!room) {
    return null;
  }

  return (
    <>
      <Routes>
        <Route path="game/:gameId/*" element={<Game room={room} />} />
      </Routes>
      {shouldShowPlayerLeftModal && playerWhoLeft && (
        <LostPlayerModal adminChanged={adminChanged} playerWhoLeft={playerWhoLeft} />
      )}
    </>
  );
};

export default Room;
