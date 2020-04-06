import React, { useEffect, useCallback } from 'react';
import { GameContainer, InnerGameContainer } from './Game.style';
import { RootState } from 'redux/types';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory, Switch, Route, useRouteMatch, useLocation } from 'react-router';
import { useFetchGame } from 'redux/Game/hooks';
import PadInit from '../PadInit';
import PadStep from '../PadStep';
import GameRecap from '../GameRecap';
import { getRedirectPath } from 'services/game.service';
import { useServerSentEvent, SERVER_EVENT_TYPES } from 'services/networking/server-events';
import { startRound, startDebrief } from 'redux/Game';
import { Credits } from '../Home/Home.style';

const Game: React.FunctionComponent = () => {
  const { gameId } = useParams();
  const [, doFetchGame] = useFetchGame();
  const room = useSelector((state: RootState) => state.room.room);
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
    if (!room || !game || !player) {
      return;
    }
    if (location.pathname !== `/room/${room.uuid}/game/${game.uuid}`) {
      return;
    }
    push(getRedirectPath(room, game, player));
  }, [game, player, push, location.pathname, room]);

  const eventCallback = useCallback(
    ({ message_type: messageType, round_number: roundNumber }) => {
      if (!room || !game || !player) return;

      switch (messageType) {
        case SERVER_EVENT_TYPES.ROUND_STARTS:
          dispatch(startRound({ roundNumber }));

          const targetStep = game.rounds.find(
            step => step.player.uuid === player.uuid && step.round_number === roundNumber,
          );
          if (!targetStep) {
            console.error(`No step found for player ${player.uuid} and round ${roundNumber}`);
            return;
          }

          return push(`/room/${room.uuid}/game/${game.uuid}/step/${targetStep.uuid}`);
        case SERVER_EVENT_TYPES.DEBRIEF_STARTS:
          doFetchGame(gameId);
          dispatch(startDebrief({}));

          return push(`/room/${room.uuid}/game/${game.uuid}/recap`);
      }
    },
    [dispatch, doFetchGame, game, gameId, player, push, room],
  );

  useServerSentEvent(`game-${game?.uuid}`, eventCallback);

  if (!game) return null;

  return (
    <GameContainer>
      <InnerGameContainer>
        <Switch>
          <Route path={`${path}/pad/:padId/init`} component={PadInit} />
          <Route path={`${path}/step/:stepId`} component={PadStep} />
          <Route path={`${path}/recap`} component={GameRecap} />
        </Switch>
      </InnerGameContainer>
      <Credits>Michèle Ruaud \ Foucauld Degeorges</Credits>
    </GameContainer>
  );
};

export default Game;
