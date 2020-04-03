import React, { useEffect, useCallback } from 'react';
import { GameContainer } from './Game.style';
import { RootState } from 'redux/types';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory, Switch, Route, useRouteMatch, useLocation } from 'react-router';
import { useFetchGame } from 'redux/Game/hooks';
import PadInit from '../PadInit';
import PadStep from '../PadStep';
import GameRecap from '../GameRecap';
import { getRedirectPath } from 'services/game.service';
import { useServerSentEvent } from 'services/networking/server-events';
import { startRound } from 'redux/Game';

const Game: React.FunctionComponent = () => {
  const { gameId } = useParams();
  const [, doFetchGame] = useFetchGame();
  const game = useSelector((state: RootState) => state.game.game);
  const player = useSelector((state: RootState) => state.player.player);
  const { push } = useHistory();
  const location = useLocation();
  const { path } = useRouteMatch();
  const dispatch = useDispatch();

  useEffect(() => {
    doFetchGame(gameId);
  }, [doFetchGame, gameId]);

  useEffect(() => {
    if (!game || !player) {
      return;
    }
    if (location.pathname !== `/game/${game.uuid}`) {
      return;
    }
    console.log('hi');
    push(getRedirectPath(game, player));
  }, [game, player, push, location.pathname]);

  const eventCallback = useCallback(
    ({ message_type: messageType, round_number: roundNumber }) => {
      if (!game || !player) return;

      dispatch(startRound({ roundNumber }));

      const targetStep = game.rounds.find(
        step => step.player.uuid === player.uuid && step.round_number === roundNumber,
      );
      if (!targetStep) {
        console.error(`No step found for player ${player.uuid} and round ${roundNumber}`);
        return;
      }

      push(`/game/${game.uuid}/step/${targetStep.uuid}`);
    },
    [dispatch, game, player, push],
  );

  useServerSentEvent(`game-${game?.uuid}`, eventCallback);

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
