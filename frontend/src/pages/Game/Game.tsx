import React, { useEffect, useCallback } from 'react';
import {
  GameContainer,
  InnerGameContainer,
  PlayerOrder,
  StyledPlayerChip,
  ArrowSpacer,
} from './Game.style';
import { useDispatch } from 'react-redux';
import { useSelector } from 'redux/useSelector';

import { useParams, useHistory, Switch, Route, useRouteMatch, useLocation } from 'react-router';
import { useFetchGame } from 'redux/Game/hooks';

import { getRedirectPath, getReorderedPlayers } from 'services/game.service';
import { useServerSentEvent, SERVER_EVENT_TYPES } from 'services/networking/server-events';
import { startRound, markPlayerFinished } from 'redux/Game';
import { Credits } from '../Home/Home.style';
import { colorPalette } from 'stylesheet';
import { GamePhase } from 'redux/Game/types';
import { selectRoom } from 'redux/Room/selectors';
import { selectGame } from 'redux/Game/selectors';
import { selectPlayer } from 'redux/Player/selectors';

const PadInit = React.lazy(() => import('../PadInit'));
const PadStep = React.lazy(() => import('../PadStep'));
const GameRecap = React.lazy(() => import('../GameRecap'));
const VoteResults = React.lazy(() => import('../VoteResults'));

const Game: React.FunctionComponent = () => {
  const { gameId } = useParams();
  const doFetchGame = useFetchGame();
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const player = useSelector(selectPlayer);
  const { push } = useHistory();
  const location = useLocation();
  const { path } = useRouteMatch();
  const dispatch = useDispatch();

  const channelName = game ? `game-${game.uuid}` : null;

  useEffect(() => {
    if (!gameId) return;

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
    ({ message_type: messageType, round_number: roundNumber, player: messagePlayer }) => {
      if (!room || !game || !player || !gameId) return;

      switch (messageType) {
        case SERVER_EVENT_TYPES.PLAYER_FINISHED:
          return dispatch(markPlayerFinished(messagePlayer));

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
          doFetchGame(game.uuid);

          return push(`/room/${room.uuid}/game/${game.uuid}/recap`);
        case SERVER_EVENT_TYPES.VOTE_RESULTS_STARTS:
          doFetchGame(game.uuid);

          return push(`/room/${room.uuid}/game/${game.uuid}/vote-results`);
      }
    },
    [dispatch, doFetchGame, game, gameId, player, push, room],
  );

  useServerSentEvent(channelName, eventCallback);

  useEffect(() => {
    if (!game) return;

    const listener = (event: BeforeUnloadEvent) => {
      if ([GamePhase.INIT, GamePhase.ROUNDS].includes(game.phase)) {
        event.returnValue = 'prevent'; // Chrome doesn't display this message anyway
      }
    };

    window.addEventListener('beforeunload', listener);

    return () => {
      window.removeEventListener('beforeunload', listener);
    };
  }, [game]);

  if (!game || !player) return null;

  const reorderedPlayers = getReorderedPlayers(game, player);

  return (
    <GameContainer>
      <InnerGameContainer hasTabs={game.phase === GamePhase.DEBRIEF}>
        {game.phase !== GamePhase.DEBRIEF && (
          <PlayerOrder>
            <StyledPlayerChip color={colorPalette.whiteTransparent}>toi</StyledPlayerChip>
            <ArrowSpacer />
            {reorderedPlayers.map(orderedPlayer => (
              <React.Fragment key={orderedPlayer.uuid}>
                <StyledPlayerChip color={colorPalette.whiteTransparent} key={orderedPlayer.uuid}>
                  {orderedPlayer.name}
                </StyledPlayerChip>
                <ArrowSpacer />
              </React.Fragment>
            ))}
            <StyledPlayerChip color={colorPalette.whiteTransparent}>toi</StyledPlayerChip>
          </PlayerOrder>
        )}
        <Switch>
          <Route path={`${path}/pad/:padId/init`} component={PadInit} />
          <Route path={`${path}/step/:stepId`} component={PadStep} />
          <Route path={`${path}/recap`} component={GameRecap} />
          <Route path={`${path}/vote-results`} component={VoteResults} />
        </Switch>
      </InnerGameContainer>
      <Credits>Michèle Ruaud \ Foucauld Degeorges</Credits>
    </GameContainer>
  );
};

export default Game;
