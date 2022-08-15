import client from 'services/networking/client';
import { useEffect, useState } from 'react';
import { useAsyncFn } from 'react-use';
import { AsyncFnReturn } from 'react-use/lib/useAsyncFn';
import { Leaderboard, LeaderboardResponse } from './types';

export const useFetchLeaderboard: (
  filter: string,
) => AsyncFnReturn<(page: number) => Promise<Leaderboard>> = (filter: string) => {
  const [leaderboard, setLeaderboard] = useState<Leaderboard>([]);

  useEffect(() => {
    setLeaderboard([]);
  }, [filter]);

  const [state, cb] = useAsyncFn(
    async (page: number) => {
      const params = new URLSearchParams({ page: page.toString() });
      if (filter) {
        params.append('filter', filter);
      }
      const leaderboardResponse: LeaderboardResponse = await client.get(
        `/leaderboard?${params.toString()}`,
      );
      setLeaderboard((currentLeaderboard) => {
        const copy = [...currentLeaderboard];
        leaderboardResponse.pageData.forEach((entry, index) => {
          copy[(leaderboardResponse.pageNumber - 1) * 10 + index] = entry;
        });
        return copy;
      });
      // fake response makes typing happy
      return leaderboardResponse.pageData;
    },
    [filter],
  );

  return [
    {
      ...state,
      value: leaderboard,
    },
    cb,
  ] as AsyncFnReturn<(page: number) => Promise<Leaderboard>>;
};
