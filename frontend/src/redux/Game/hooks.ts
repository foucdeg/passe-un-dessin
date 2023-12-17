import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { selectPlayerId } from 'redux/Player/selectors';
import { useGetRanking } from 'redux/Room/hooks';
import { selectRoom } from 'redux/Room/selectors';
import { useSelector } from 'redux/useSelector';
import { getNextPhaseAndRound, getRedirectPath } from 'services/game.service';
import client from 'services/networking/client';
import { wait } from 'services/utils';
import { Room } from 'redux/Room/types';
import { useAsyncFn } from 'react-use';
import {
  DEFAULT_CONTROLLED_REVEAL_BOOL,
  DEFAULT_DRAW_OWN_WORD_BOOL,
  DEFAULT_ROUND_DURATION,
} from './constants';
import { selectGame } from './selectors';
import {
  setSuggestions,
  setWinners,
  updateGame,
  addVoteToPadStep,
  removeVoteFromPadStep,
} from './slice';
import { Pad, GamePhase, Game, RawGame, PadStep } from './types';

export const useFetchGame = () => {
  const dispatch = useDispatch();

  return useAsyncFn(
    async (gameId: string, keepStructure = false, asPublic = false) => {
      const rawGame: RawGame = await client.get(`/game/${gameId}`);

      const game: Game = {
        ...rawGame,
        players: rawGame.participants.map((participant) => participant.player),
      };
      if (!asPublic) {
        dispatch(updateGame({ game, keepStructure }));
      }
      return game;
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
  const playerId = useSelector(selectPlayerId);
  const navigate = useNavigate();

  return useAsyncFn(async () => {
    if (!room || !game || !playerId) return;

    const updatedGame: Game = await client.get(`/game/${game.uuid}`);

    if ([GamePhase.REVEAL, GamePhase.DEBRIEF, GamePhase.VOTE_RESULTS].includes(updatedGame.phase)) {
      const updatedRoom: Room = await client.get(`/room/${room.uuid}`);

      if (updatedRoom.current_game_id !== updatedGame.uuid) {
        const path = `/room/${updatedRoom.uuid}/game/${updatedRoom.current_game_id}`;
        return navigate(path);
      }
    }

    const path = getRedirectPath(room, updatedGame, playerId);
    navigate(path);
  }, [room, game, playerId]);
};

export const useStartGame = () => {
  const navigate = useNavigate();

  return useCallback(
    async (
      roomId: string,
      roundDuration: number,
      drawOwnWord: boolean,
      controlledReveal: boolean,
      playersOrder?: string[] | null,
    ) => {
      try {
        const { game_id: gameId } = await client.put(`/room/${roomId}/start`, {
          roundDuration,
          playersOrder,
          drawOwnWord,
          controlledReveal,
        });
        if (window.gtag) {
          window.gtag('event', 'start_game', {
            event_category: 'engagement',
          });
        }
        localStorage.setItem('preferredRoundDuration', roundDuration.toString());
        localStorage.setItem('prefferedDrawOwnWord', drawOwnWord.toString());
        localStorage.setItem('controlledReveal', controlledReveal.toString());
        navigate(`/room/${roomId}/game/${gameId}`);
      } catch (e) {
        alert('Error - see console');
        console.error(e);
      }
    },
    [navigate],
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

export const usePublicVoteResults = (gameId: string) => {
  return useAsyncFn(async () => {
    const response: { winners: PadStep[] } = await client.get(`/game/${gameId}/vote-results`);
    return response.winners;
  }, [gameId]);
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

export const useControlledRevealSwitch = (initialValue?: boolean) => {
  const useControlledRevealStr = localStorage.getItem('controlledReveal');

  return useState<boolean>(
    initialValue !== undefined
      ? initialValue
      : useControlledRevealStr !== null
        ? useControlledRevealStr === 'true'
        : DEFAULT_CONTROLLED_REVEAL_BOOL,
  );
};

export const useSaveVote = () => {
  const dispatch = useDispatch();
  const playerId = useSelector(selectPlayerId);

  return useCallback(
    async (padStepId: string) => {
      if (!playerId) return;

      dispatch(addVoteToPadStep({ padStepId, playerId }));
      try {
        await client.post(`/step/${padStepId}/vote`);
      } catch (e) {
        alert('Error - see console');
        console.error(e);
      }
    },
    [dispatch, playerId],
  );
};

export const useDeleteVote = () => {
  const dispatch = useDispatch();
  const playerId = useSelector(selectPlayerId);

  return useCallback(
    async (padStepId: string) => {
      if (!playerId) return;

      dispatch(removeVoteFromPadStep({ padStepId, playerId }));
      try {
        await client.delete(`/step/${padStepId}/vote`);
      } catch (e) {
        alert('Error - see console');
        console.error(e);
      }
    },
    [dispatch, playerId],
  );
};

export const useCheckIfPlayerShouldJoin = () => {
  const navigate = useNavigate();
  const room = useSelector(selectRoom);

  return useCallback(
    async (gameId: string) => {
      if (!room) return;

      try {
        const response = await client.get(`/game/${gameId}/player-should-join`);
        if (
          response.is_in_game ||
          [GamePhase.REVEAL, GamePhase.DEBRIEF, GamePhase.VOTE_RESULTS].includes(response.phase)
        ) {
          navigate(`/room/${room.uuid}/game/${gameId}`);
        }
      } catch (e) {
        alert('Error - see console');
        console.error(e);
      }
    },
    [navigate, room],
  );
};
