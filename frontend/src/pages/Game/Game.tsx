import React, { useEffect, useCallback } from 'react';
import {
  GameContainer,
  InnerGameContainer,
  PreviousNextPlayers,
  StyledPlayerChip,
} from './Game.style';
import { RootState } from 'redux/types';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory, Switch, Route, useRouteMatch, useLocation } from 'react-router';
import { useFetchGame } from 'redux/Game/hooks';
import PadInit from '../PadInit';
import PadStep from '../PadStep';
import GameRecap from '../GameRecap';
import { getRedirectPath, getPreviousNextPlayers } from 'services/game.service';
import { useServerSentEvent, SERVER_EVENT_TYPES } from 'services/networking/server-events';
import { startRound, startDebrief, markPlayerFinished } from 'redux/Game';
import { Credits } from '../Home/Home.style';
import { colorPalette } from 'stylesheet';
import { GamePhase } from 'redux/Game/types';

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
    ({ message_type: messageType, round_number: roundNumber, player: messagePlayer }) => {
      if (!room || !game || !player) return;

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
          doFetchGame(gameId);
          dispatch(startDebrief({}));

          return push(`/room/${room.uuid}/game/${game.uuid}/recap`);
      }
    },
    [dispatch, doFetchGame, game, gameId, player, push, room],
  );

  useServerSentEvent(`game-${game?.uuid}`, eventCallback);

  useEffect(() => {
    if (!game) return;

    const listener = (event: BeforeUnloadEvent) => {
      switch (game.phase) {
        case GamePhase.INIT:
        case GamePhase.ROUNDS:
          event.returnValue =
            'Si vous quittez la partie, les autres joueurs ne pourront pas la terminer.\n' +
            'Mieux vaut quitter la partie à la fin. \n' +
            'Êtes-vous sûr(e) de vouloir la quitter maintenant ?';
          break;
        case GamePhase.DEBRIEF:
          alert('clean leave');
      }
    };

    window.addEventListener('beforeunload', listener);

    return () => {
      window.removeEventListener('beforeunload', listener);
    };
  }, [game]);

  if (!game || !player) return null;

  const [previousPlayer, nextPlayer] = getPreviousNextPlayers(game, player);

  return (
    <GameContainer>
      <InnerGameContainer hasTabs={game.phase === GamePhase.DEBRIEF}>
        {game.phase !== GamePhase.DEBRIEF && (
          <PreviousNextPlayers>
            <StyledPlayerChip color={colorPalette.whiteTransparent}>
              {previousPlayer.name} est avant toi
            </StyledPlayerChip>
            <StyledPlayerChip color={colorPalette.whiteTransparent}>
              {nextPlayer.name} est après toi
            </StyledPlayerChip>
          </PreviousNextPlayers>
        )}
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
