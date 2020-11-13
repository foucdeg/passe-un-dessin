import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import {
  markPlayerFinished,
  markPlayerNotFinished,
  setPlayerViewingPad,
  startRound,
} from 'redux/Game';
import { useFetchGame } from 'redux/Game/hooks';
import { selectGameStructure } from 'redux/Game/selectors';
import { Pad } from 'redux/Game/types';
import { selectPlayer } from 'redux/Player/selectors';
import { Player } from 'redux/Player/types';
import { selectRoom } from 'redux/Room/selectors';
import { useSelector } from 'redux/useSelector';
import { useServerSentEvent } from 'services/networking/server-events';

enum GAME_EVENT_TYPE {
  PLAYER_FINISHED = 'PLAYER_FINISHED',
  PLAYER_NOT_FINISHED = 'PLAYER_NOT_FINISHED',
  ROUND_STARTS = 'ROUND_STARTS',
  DEBRIEF_STARTS = 'DEBRIEF_STARTS',
  PLAYER_VIEWING_PAD = 'PLAYER_VIEWING_PAD',
  VOTE_RESULTS_STARTS = 'VOTE_RESULTS_STARTS',
}

interface GameEvent {
  message_type: GAME_EVENT_TYPE;
}

type PlayerFinishedEvent = GameEvent & {
  message_type: GAME_EVENT_TYPE.PLAYER_FINISHED;
  player: Player;
};
const isPlayerFinishedEvent = (event: GameEvent): event is PlayerFinishedEvent =>
  event.message_type === GAME_EVENT_TYPE.PLAYER_FINISHED;

type PlayerNotFinishedEvent = GameEvent & {
  message_type: GAME_EVENT_TYPE.PLAYER_NOT_FINISHED;
  player: Player;
};
const isPlayerNotFinishedEvent = (event: GameEvent): event is PlayerNotFinishedEvent =>
  event.message_type === GAME_EVENT_TYPE.PLAYER_NOT_FINISHED;

type RoundStartsEvent = GameEvent & {
  message_type: GAME_EVENT_TYPE.ROUND_STARTS;
  round_number: number;
};
const isRoundStartsEvent = (event: GameEvent): event is RoundStartsEvent =>
  event.message_type === GAME_EVENT_TYPE.ROUND_STARTS;

type DebriefStartsEvent = GameEvent & {
  message_type: GAME_EVENT_TYPE.DEBRIEF_STARTS;
};
const isDebriefStartsEvent = (event: GameEvent): event is DebriefStartsEvent =>
  event.message_type === GAME_EVENT_TYPE.DEBRIEF_STARTS;

type PlayerViewingPadEvent = GameEvent & {
  message_type: GAME_EVENT_TYPE.PLAYER_VIEWING_PAD;
  player: Player;
  pad: Pad;
};
const isPlayerViewingPadEvent = (event: GameEvent): event is PlayerViewingPadEvent =>
  event.message_type === GAME_EVENT_TYPE.PLAYER_VIEWING_PAD;

type VoteResultsStartsEvent = GameEvent & {
  message_type: GAME_EVENT_TYPE.VOTE_RESULTS_STARTS;
};
const isVoteResultsStartsEvent = (event: GameEvent): event is VoteResultsStartsEvent =>
  event.message_type === GAME_EVENT_TYPE.VOTE_RESULTS_STARTS;

const useGameEvents = (gameId: string) => {
  const [, doFetchGame] = useFetchGame();
  const dispatch = useDispatch();
  const { push } = useHistory();
  const gameStructure = useSelector(selectGameStructure);
  const room = useSelector(selectRoom);
  const player = useSelector(selectPlayer);

  const eventCallback = useCallback(
    (event: GameEvent) => {
      if (!room || !gameStructure || !player || !gameId) return;
      if (gameStructure.uuid !== gameId) return;

      if (isPlayerFinishedEvent(event)) {
        dispatch(markPlayerFinished(event.player));
        return;
      }
      if (isPlayerNotFinishedEvent(event)) {
        dispatch(markPlayerNotFinished(event.player));
        return;
      }
      if (isRoundStartsEvent(event)) {
        dispatch(startRound({ roundNumber: event.round_number }));

        const targetStep = gameStructure.rounds.find(
          (step) => step.player.uuid === player.uuid && step.round_number === event.round_number,
        );
        if (!targetStep) {
          console.error(`No step found for player ${player.uuid} and round ${event.round_number}`);
          return;
        }

        push(`/room/${room.uuid}/game/${gameStructure.uuid}/step/${targetStep.uuid}`);
        return;
      }
      if (isDebriefStartsEvent(event)) {
        doFetchGame({ gameId: gameStructure.uuid, keepStructure: true });
        push(`/room/${room.uuid}/game/${gameStructure.uuid}/recap`);
        return;
      }
      if (isPlayerViewingPadEvent(event)) {
        dispatch(setPlayerViewingPad({ player: event.player, pad: event.pad }));
        return;
      }
      if (isVoteResultsStartsEvent(event)) {
        doFetchGame({ gameId: gameStructure.uuid, keepStructure: true });
        push(`/room/${room.uuid}/game/${gameStructure.uuid}/vote-results`);
        return;
      }
    },
    [dispatch, doFetchGame, gameId, gameStructure, player, push, room],
  );

  useServerSentEvent(`game-${gameId}`, eventCallback);
};

export default useGameEvents;
