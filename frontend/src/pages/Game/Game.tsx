import React, { useEffect } from 'react';
import { GameContainer } from './Game.style';
import { RootState } from 'redux/types';
import { useSelector } from 'react-redux';
import { useParams, useHistory, Switch, Route, useRouteMatch } from 'react-router';
import { useFetchGame } from 'redux/Game/hooks';
import PadInit from '../PadInit';
import PadStep from '../PadStep';
import GameRecap from '../GameRecap';
import { getRedirectPath } from 'services/game.service';

const Game: React.FunctionComponent = () => {
  const { gameId } = useParams();
  const [, doFetchGame] = useFetchGame();
  const game = useSelector((state: RootState) => state.game.game);
  const player = useSelector((state: RootState) => state.player.player);
  const { push } = useHistory();
  const { path } = useRouteMatch();

  useEffect(() => {
    doFetchGame(gameId);
  }, [doFetchGame, gameId]);

  useEffect(() => {
    if (!game || !player) {
      return;
    }
    const redirectToPath = getRedirectPath(game, player);
    if (redirectToPath !== path) {
      push(redirectToPath);
    }
  }, [game, path, player, push]);

  if (!game) return null;

  return (
    <GameContainer>
      <p>Bienvenue sur la game {game.uuid} !</p>
      <Switch>
        <Route path={`${path}/pad/:padId/init`} component={PadInit} />
        <Route path={`${path}/step/:stepId`} component={PadStep} />
        <Route path={`${path}/recap`} component={GameRecap} />
      </Switch>
    </GameContainer>
  );
};

export default Game;
