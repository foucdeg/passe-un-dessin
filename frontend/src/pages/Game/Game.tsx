import React, { useEffect } from 'react';
import GameContainer from 'layout/GameLayout/GameContainer';
import InnerGameContainer from 'layout/GameLayout/InnerGameContainer';
import HomeButton from 'atoms/HomeButton';

import { useSelector } from 'redux/useSelector';

import { useParams, useNavigate, Routes, Route, useLocation } from 'react-router';
import { useFetchGame } from 'redux/Game/hooks';

import { getRedirectPath } from 'services/game.service';
import { GamePhase } from 'redux/Game/types';
import { selectGame } from 'redux/Game/selectors';
import { selectPlayerId } from 'redux/Player/selectors';
import { useLeaveRoom } from 'redux/Room/hooks';
import Loader from 'atoms/Loader';
import { Room } from 'redux/Room/types';

import PadStep from '../PadStep';
import GameRecap from '../GameRecap';
import VoteResults from '../VoteResults';
import useGameEvents from './events';
import PlayerOrder from './components/PlayerOrder';

interface Props {
  room: Room;
}

interface RouteParams {
  gameId: string;
}

const Game: React.FunctionComponent<Props> = ({ room }) => {
  const { gameId } = useParams<keyof RouteParams>() as RouteParams;
  const [{ loading }, doFetchGame] = useFetchGame();
  const game = useSelector(selectGame);
  const playerId = useSelector(selectPlayerId);
  const navigate = useNavigate();
  const location = useLocation();
  const doLeaveRoom = useLeaveRoom();

  useGameEvents(gameId);

  useEffect(() => {
    if (!gameId) return;
    doFetchGame(gameId);
  }, [doFetchGame, gameId]);

  useEffect(() => {
    if (!room || !game || !playerId) {
      return;
    }
    if (location.pathname !== `/room/${room.uuid}/game/${game.uuid}`) {
      return;
    }
    navigate(getRedirectPath(room, game, playerId));
  }, [game, playerId, navigate, location.pathname, room]);

  useEffect(() => {
    if (!game) return;

    const listener = (event: BeforeUnloadEvent) => {
      if (game.phase === GamePhase.ROUNDS) {
        event.returnValue = 'prevent'; // Chrome doesn't display this message anyway
      }
    };

    window.addEventListener('beforeunload', listener);

    return () => {
      window.removeEventListener('beforeunload', listener);
    };
  }, [game]);

  if (loading || !game) {
    return (
      <GameContainer>
        <InnerGameContainer>
          <Loader />
        </InnerGameContainer>
      </GameContainer>
    );
  }

  if (!room || !playerId) {
    return null;
  }

  return (
    <GameContainer>
      <HomeButton onClick={doLeaveRoom} />
      <InnerGameContainer hasTabs={!!window.location.pathname.match(/\/recap$/)}>
        {game.phase === GamePhase.ROUNDS && <PlayerOrder />}
        <Routes>
          <Route path="step/:stepId" element={<PadStep game={game} />} />
          <Route path="recap" element={<GameRecap room={room} game={game} />} />
          <Route path="vote-results" element={<VoteResults room={room} game={game} />} />
        </Routes>
      </InnerGameContainer>
    </GameContainer>
  );
};

export default Game;
