import React, { useEffect, useCallback } from 'react';
import GameContainer from 'layout/GameLayout/GameContainer';
import InnerGameContainer from 'layout/GameLayout/InnerGameContainer';
import HomeButton from 'atoms/HomeButton';

import { useDispatch } from 'react-redux';
import { useSelector } from 'redux/useSelector';

import { useParams, useHistory, Switch, Route, useRouteMatch, useLocation } from 'react-router';
import { useFetchGame } from 'redux/Game/hooks';

import { getRedirectPath } from 'services/game.service';
import { useServerSentEvent, SERVER_EVENT_TYPES } from 'services/networking/server-events';
import {
  startRound,
  markPlayerFinished,
  markPlayerNotFinished,
  setPlayerViewingPad,
} from 'redux/Game';
import { GamePhase } from 'redux/Game/types';
import { selectRoom } from 'redux/Room/selectors';
import { selectGame, selectGameStructure } from 'redux/Game/selectors';
import { selectPlayer } from 'redux/Player/selectors';
import { useLeaveRoom } from 'redux/Room/hooks';
import Loader from 'atoms/Loader';
import PlayerOrder from './components/PlayerOrder';

const PadInit = React.lazy(() => import('../PadInit'));
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
  const gameStructure = useSelector(selectGameStructure);
  const player = useSelector(selectPlayer);
  const { push } = useHistory();
  const location = useLocation();
  const { path } = useRouteMatch();
  const dispatch = useDispatch();
  const doLeaveRoom = useLeaveRoom();

  const channelName = game ? `game-${game.uuid}` : null;

  useEffect(() => {
    if (!gameId) return;
    doFetchGame({ gameId });
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
    ({
      message_type: messageType,
      round_number: roundNumber,
      player: messagePlayer,
      pad: messagePad,
    }) => {
      if (!room || !gameStructure || !player || !gameId) return;
      if (gameStructure.uuid !== gameId) return;

      switch (messageType) {
        case SERVER_EVENT_TYPES.PLAYER_FINISHED:
          return dispatch(markPlayerFinished(messagePlayer));

        case SERVER_EVENT_TYPES.PLAYER_NOT_FINISHED:
          return dispatch(markPlayerNotFinished(messagePlayer));

        case SERVER_EVENT_TYPES.ROUND_STARTS:
          dispatch(startRound({ roundNumber }));

          const targetStep = gameStructure.rounds.find(
            (step) => step.player.uuid === player.uuid && step.round_number === roundNumber,
          );
          if (!targetStep) {
            console.error(`No step found for player ${player.uuid} and round ${roundNumber}`);
            return;
          }

          return push(`/room/${room.uuid}/game/${gameStructure.uuid}/step/${targetStep.uuid}`);
        case SERVER_EVENT_TYPES.DEBRIEF_STARTS:
          doFetchGame({ gameId: gameStructure.uuid, keepStructure: true });

          return push(`/room/${room.uuid}/game/${gameStructure.uuid}/recap`);
        case SERVER_EVENT_TYPES.PLAYER_VIEWING_PAD:
          return dispatch(setPlayerViewingPad({ player: messagePlayer, pad: messagePad }));

        case SERVER_EVENT_TYPES.VOTE_RESULTS_STARTS:
          doFetchGame({ gameId: gameStructure.uuid, keepStructure: true });

          return push(`/room/${room.uuid}/game/${gameStructure.uuid}/vote-results`);
      }
    },
    [dispatch, doFetchGame, gameId, gameStructure, player, push, room],
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

  if (loading) {
    return (
      <GameContainer>
        <InnerGameContainer>
          <Loader />
        </InnerGameContainer>
      </GameContainer>
    );
  }

  if (!room || !game || !player) return null;

  return (
    <GameContainer>
      <HomeButton onClick={doLeaveRoom} />
      <InnerGameContainer hasTabs={!!window.location.pathname.match(/\/recap$/)}>
        {[GamePhase.INIT, GamePhase.ROUNDS].includes(game.phase) && <PlayerOrder />}
        <Switch>
          <Route path={`${path}/pad/:padId/init`} component={PadInit} />
          <Route path={`${path}/step/:stepId`} component={PadStep} />
          <Route path={`${path}/recap`} component={GameRecap} />
          <Route path={`${path}/vote-results`} component={VoteResults} />
        </Switch>
      </InnerGameContainer>
    </GameContainer>
  );
};

export default Game;
