import React, { useEffect, useCallback } from 'react';
import { GameContainer, InnerGameContainer, HomeLink, HomeButton } from './Game.style';
import { useDispatch } from 'react-redux';
import { useSelector } from 'redux/useSelector';

import { useParams, useHistory, Switch, Route, useRouteMatch, useLocation } from 'react-router';
import { useFetchGame } from 'redux/Game/hooks';

import { getRedirectPath } from 'services/game.service';
import { useServerSentEvent, SERVER_EVENT_TYPES } from 'services/networking/server-events';
import { startRound, markPlayerFinished, setPlayerViewingPad } from 'redux/Game';
import { GamePhase } from 'redux/Game/types';
import { selectRoom } from 'redux/Room/selectors';
import { selectGame } from 'redux/Game/selectors';
import { selectPlayer } from 'redux/Player/selectors';
import PlayerOrder from 'components/PlayerOrder';
import { useIntl } from 'react-intl';
import { useLeaveRoom } from 'redux/Room/hooks';
import Loader from 'components/Loader';

const PadInit = React.lazy(() => import('../PadInit'));
const PadStep = React.lazy(() => import('../PadStep'));
const GameRecap = React.lazy(() => import('../GameRecap'));
const VoteResults = React.lazy(() => import('../VoteResults'));

const Game: React.FunctionComponent = () => {
  const { gameId } = useParams();
  const [{ loading }, doFetchGame] = useFetchGame();
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const player = useSelector(selectPlayer);
  const { push } = useHistory();
  const location = useLocation();
  const { path } = useRouteMatch();
  const dispatch = useDispatch();
  const intl = useIntl();
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
          doFetchGame({ gameId: game.uuid });

          return push(`/room/${room.uuid}/game/${game.uuid}/recap`);
        case SERVER_EVENT_TYPES.PLAYER_VIEWING_PAD:
          return dispatch(setPlayerViewingPad({ player: messagePlayer, pad: messagePad }));

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

  if (loading) {
    return (
      <GameContainer>
        <InnerGameContainer hasTabs={false}>
          <Loader />
        </InnerGameContainer>
      </GameContainer>
    );
  }

  if (!room || !game || !player) return null;

  const checkLeaveRoom = (event: React.MouseEvent) => {
    const isOkayToLeave = [GamePhase.DEBRIEF].includes(game.phase);

    if (isOkayToLeave || window.confirm(intl.formatMessage({ id: 'menu.confirmLeave' }))) {
      doLeaveRoom(room);
    } else {
      event.preventDefault();
      return false;
    }
  };

  return (
    <GameContainer>
      <HomeLink to="/" onClick={checkLeaveRoom}>
        <HomeButton />
      </HomeLink>
      <InnerGameContainer hasTabs={game.phase === GamePhase.DEBRIEF}>
        {game.phase !== GamePhase.DEBRIEF && <PlayerOrder />}
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
