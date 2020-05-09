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
import { useTypedAsyncFn, wait } from 'services/utils';
import { DEFAULT_DRAW_OWN_WORD_BOOL, DEFAULT_ROUND_DURATION } from './constants';
import { selectGame } from './selectors';
import { setSuggestions, setWinners, updateGame, updatePad, updatePadStep } from './slice';
import { Pad } from './types';

export const useFetchGame = () => {
  const dispatch = useDispatch();

  return useTypedAsyncFn<{ gameId: string }>(
    async ({ gameId }) => {
      const game = await client.get(`/game/${gameId}`);
      dispatch(updateGame(game));
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

  const [, doFetchGame] = useFetchGame();

  return useTypedAsyncFn<{}>(async () => {
    if (!room || !game || !player) return;

    await doFetchGame({ gameId: game.uuid });
    const path = getRedirectPath(room, game, player);
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
    async (gameId: string, roomId: string) => {
      try {
        const response = await client.get(`/game/${gameId}/vote-results`);
        dispatch(setWinners(response['winners']));
        doGetRanking(roomId);
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

  return useTypedAsyncFn<{ pad: Pad; sentence: string }>(
    async ({ pad, sentence }) => {
      const updatedPad = await client.put(`/pad/${pad.uuid}/save`, { sentence });
      dispatch(updatePad(updatedPad));
    },
    [dispatch],
  );
};

export const useForceState = () => {
  const game = useSelector(selectGame);

  return useTypedAsyncFn<{}>(async () => {
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

  return useCallback(
    async (padStepId: string) => {
      try {
        const updatedStep = await client.post(`/step/${padStepId}/vote`);
        dispatch(updatePadStep(updatedStep));
      } catch (e) {
        alert('Error - see console');
        console.error(e);
      }
    },
    [dispatch],
  );
};

export const useDeleteVote = () => {
  const dispatch = useDispatch();

  return useCallback(
    async (padStepId: string) => {
      try {
        const updatedStep = await client.delete(`/step/${padStepId}/vote`);
        dispatch(updatePadStep(updatedStep));
      } catch (e) {
        alert('Error - see console');
        console.error(e);
      }
    },
    [dispatch],
  );
};

export const useCheckIfPlayerIsInGame = () => {
  const { push } = useHistory();
  const room = useSelector(selectRoom);

  return useCallback(
    async (gameId: string) => {
      if (!room) return;

      try {
        const response = await client.get(`/game/${gameId}/is-player-in-game`);
        if (response.is_in_game) {
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
