import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NoProps, useDebouncedState } from 'services/utils';

import { FormattedMessage, useIntl } from 'react-intl';
import HomeLayout from 'layout/HomeLayout';
import { useFetchLeaderboard } from './hooks';
import {
  StyledHeader,
  StyledScoreboard,
  ScoreboardWithFilter,
  FilterInput,
} from './Leaderboard.style';

const Leaderboard: React.FC<NoProps> = () => {
  const [liveFilter, debouncedFilter, setFilter] = useDebouncedState<string>('', 500);
  const [{ value: leaderboard }, doFetchLeaderboard] = useFetchLeaderboard(debouncedFilter);
  const intl = useIntl();
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    doFetchLeaderboard(page);
  }, [doFetchLeaderboard, page]);

  const fetchNextPage = useCallback(() => {
    if (leaderboard && leaderboard.length === page * 10) {
      setPage(page + 1);
    }
  }, [leaderboard, page]);

  const formattedLeaderboard = useMemo(
    () =>
      leaderboard
        ? Object.values(leaderboard).map((item) => ({
            ...item,
            score: item.total_score,
          }))
        : [],
    [leaderboard],
  );

  return (
    <HomeLayout>
      <StyledHeader>
        <FormattedMessage id="leaderboard.title" />
      </StyledHeader>
      <ScoreboardWithFilter>
        <StyledScoreboard
          onScrollEnd={fetchNextPage}
          list={formattedLeaderboard}
          showRankings
          filter={debouncedFilter}
          links
        />
        <FilterInput
          type="text"
          placeholder={intl.formatMessage({ id: 'leaderboard.filterInput' })}
          value={liveFilter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </ScoreboardWithFilter>
    </HomeLayout>
  );
};

export default Leaderboard;
