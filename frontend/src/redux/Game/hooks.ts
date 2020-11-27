import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { selectPlayer } from 'redux/Player/selectors';
import { useGetRanking } from 'redux/Room/hooks';
import { selectRoom } from 'redux/Room/selectors';
import { useSelector } from 'redux/useSelector';
import { getNextPhaseAndRound, getRedirectPath } from 'services/game.service';
import client from 'services/networking/client';
import { wait } from 'services/utils';
import { Room } from 'redux/Room/types';
import { useAsyncFn } from 'react-use';
import { DEFAULT_DRAW_OWN_WORD_BOOL, DEFAULT_ROUND_DURATION } from './constants';
import { selectGame } from './selectors';
import {
  setSuggestions,
  setWinners,
  updateGame,
  updatePad,
  addVoteToPadStep,
  removeVoteFromPadStep,
} from './slice';
import { Pad, GamePhase, Game, RawGame } from './types';

export const useFetchGame = () => {
  const dispatch = useDispatch();

  return useAsyncFn(
    async (gameId: string, keepStructure = false, asPublic = false) => {
      const rawGame: RawGame = await client.get(`/game/${gameId}`);

      const game = {
        ...rawGame,
        players: rawGame.participants.map((participant) => participant.player),
      };
      dispatch(updateGame({ game, keepStructure, asPublic }));
    },
    [dispatch],
  );
};

export const useGetSuggestions = () => {
  const dispatch = useDispatch();
  const intl = useIntl();

  return useCallback(async () => {
    const [, { suggestions }] = (await Promise.all([
      wait(1000),
      client.get(`/suggestions?language=${intl.locale}`),
    ])) as [void, { suggestions: string[] }];
    dispatch(setSuggestions(suggestions));
  }, [dispatch, intl.locale]);
};

export const useRefreshGame = () => {
  const room = useSelector(selectRoom);
  const game = useSelector(selectGame);
  const player = useSelector(selectPlayer);
  const { push } = useHistory();

  return useAsyncFn(async () => {
    if (!room || !game || !player) return;

    const updatedGame: Game = await client.get(`/game/${game.uuid}`);

    if ([GamePhase.DEBRIEF, GamePhase.VOTE_RESULTS].includes(updatedGame.phase)) {
      const updatedRoom: Room = await client.get(`/room/${room.uuid}`);

      if (updatedRoom.current_game_id !== updatedGame.uuid) {
        const path = `/room/${updatedRoom.uuid}/game/${updatedRoom.current_game_id}`;
        return push(path);
      }
    }

    const path = getRedirectPath(room, updatedGame, player);
    push(path);
  }, [room, game, player]);
};

export const useStartGame = () => {
  const history = useHistory();

  return useCallback(
    async (
      roomId: string,
      roundDuration: number,
      drawOwnWord: boolean,
      playersOrder?: string[] | null,
    ) => {
      try {
        const { game_id: gameId } = await client.put(`/room/${roomId}/start`, {
          roundDuration,
          playersOrder,
          drawOwnWord,
        });
        const gtag = (window as any).gtag; // eslint-disable-line @typescript-eslint/no-explicit-any
        gtag('event', 'start_game', {
          event_category: 'engagement',
        });
        localStorage.setItem('preferredRoundDuration', roundDuration.toString());
        localStorage.setItem('prefferedDrawOwnWord', drawOwnWord.toString());
        history.push(`/room/${roomId}/game/${gameId}`);
      } catch (e) {
        alert('Error - see console');
        console.error(e);
      }
    },
    [history],
  );
};

export const useGetVoteResults = () => {
  const dispatch = useDispatch();
  const doGetRanking = useGetRanking();

  return useCallback(
    async (gameId: string, roomId?: string) => {
      try {
        const response = await client.get(`/game/${gameId}/vote-results`);
        dispatch(setWinners(response['winners']));
        if (roomId) {
          doGetRanking(roomId);
        }
      } catch (e) {
        alert('Error - see console');
        console.error(e);
      }
    },
    [dispatch, doGetRanking],
  );
};

export const useSavePad = () => {
  const dispatch = useDispatch();

  return useAsyncFn(
    async (pad: Pad, sentence: string | null) => {
      const updatedPad = await client.put(`/pad/${pad.uuid}/save`, { sentence });
      dispatch(updatePad(updatedPad));
    },
    [dispatch],
  );
};

export const useForceState = () => {
  const game = useSelector(selectGame);

  return useAsyncFn(async () => {
    if (!game) {
      return;
    }
    const [nextPhase, nextRound] = getNextPhaseAndRound(game);

    await client.put(`/game/${game.uuid}/force-state`, { nextPhase, nextRound });
  }, [game]);
};

export const useReviewPad = () => {
  return useCallback(async (pad: Pad) => {
    try {
      await client.put(`/pad/${pad.uuid}/review`, {});
    } catch (e) {
      alert('Error - see console');
      console.error(e);
    }
  }, []);
};

export const useRoundDuration = (initialValue?: number | null) => {
  const preferredRoundDurationStr = localStorage.getItem('preferredRoundDuration');
  const preferredRoundDuration = preferredRoundDurationStr
    ? parseInt(preferredRoundDurationStr)
    : null;

  return useState<number>(initialValue || preferredRoundDuration || DEFAULT_ROUND_DURATION);
};

export const useDrawOwnWordSwitch = (initialValue?: boolean) => {
  const useDrawOwnWordStr = localStorage.getItem('prefferedDrawOwnWord');

  return useState<boolean>(
    initialValue !== undefined
      ? initialValue
      : useDrawOwnWordStr !== null
      ? useDrawOwnWordStr === 'true'
      : DEFAULT_DRAW_OWN_WORD_BOOL,
  );
};

export const useSaveVote = () => {
  const dispatch = useDispatch();
  const player = useSelector(selectPlayer);

  return useCallback(
    async (padStepId: string) => {
      if (!player) return;

      dispatch(addVoteToPadStep({ padStepId, player }));
      try {
        await client.post(`/step/${padStepId}/vote`);
      } catch (e) {
        alert('Error - see console');
        console.error(e);
      }
    },
    [dispatch, player],
  );
};

export const useDeleteVote = () => {
  const dispatch = useDispatch();
  const player = useSelector(selectPlayer);

  return useCallback(
    async (padStepId: string) => {
      if (!player) return;

      dispatch(removeVoteFromPadStep({ padStepId, player }));
      try {
        await client.delete(`/step/${padStepId}/vote`);
      } catch (e) {
        alert('Error - see console');
        console.error(e);
      }
    },
    [dispatch, player],
  );
};

export const useCheckIfPlayerShouldJoin = () => {
  const { push } = useHistory();
  const room = useSelector(selectRoom);

  return useCallback(
    async (gameId: string) => {
      if (!room) return;

      try {
        const response = await client.get(`/game/${gameId}/player-should-join`);
        if (
          response.is_in_game ||
          [GamePhase.DEBRIEF, GamePhase.VOTE_RESULTS].includes(response.phase)
        ) {
          push(`/room/${room.uuid}/game/${gameId}`);
        }
      } catch (e) {
        alert('Error - see console');
        console.error(e);
      }
    },
    [push, room],
  );
};
