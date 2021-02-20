import React, { useEffect } from 'react';
import GameContainer from 'layout/GameLayout/GameContainer';
import InnerGameContainer from 'layout/GameLayout/InnerGameContainer';
import HomeButton from 'atoms/HomeButton';

import { useSelector } from 'redux/useSelector';

import { useParams, useHistory, Switch, Route, useRouteMatch, useLocation } from 'react-router';
import { useFetchGame } from 'redux/Game/hooks';

import { getRedirectPath } from 'services/game.service';
import { GamePhase } from 'redux/Game/types';
import { selectRoom } from 'redux/Room/selectors';
import { selectGame } from 'redux/Game/selectors';
import { selectPlayerId } from 'redux/Player/selectors';
import { useLeaveRoom } from 'redux/Room/hooks';
import Loader from 'atoms/Loader';
import PlayerOrder from './components/PlayerOrder';
import useGameEvents from './events';

const PadStep = React.lazy(() => import('../PadStep'));
const GameRecap = React.lazy(() => import('../GameRecap'));
const VoteResults = React.lazy(() => import('../VoteResults'));

interface RouteParams {
  gameId: string;
}

const Game: React.FunctionComponent = () => {
  const { gameId } = useParams<RouteParams>();
  const [{ loading }, doFetchGame] = useFetchGame();
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const playerId = useSelector(selectPlayerId);
  const { push } = useHistory();
  const location = useLocation();
  const { path } = useRouteMatch();
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
    push(getRedirectPath(room, game, playerId));
  }, [game, playerId, push, location.pathname, room]);

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

  if (loading) {
    return (
      <GameContainer>
        <InnerGameContainer>
          <Loader />
        </InnerGameContainer>
      </GameContainer>
    );
  }

  if (!room || !game || !playerId) return null;

  return (
    <GameContainer>
      <HomeButton onClick={doLeaveRoom} />
      <InnerGameContainer hasTabs={!!window.location.pathname.match(/\/recap$/)}>
        {game.phase === GamePhase.ROUNDS && <PlayerOrder />}
        <Switch>
          <Route path={`${path}/step/:stepId`} component={PadStep} />
          <Route path={`${path}/recap`} component={GameRecap} />
          <Route path={`${path}/vote-results`} component={VoteResults} />
        </Switch>
      </InnerGameContainer>
    </GameContainer>
  );
};

export default Game;
