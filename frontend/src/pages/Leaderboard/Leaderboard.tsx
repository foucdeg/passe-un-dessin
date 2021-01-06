import React, { useEffect, useMemo } from 'react';
import { NoProps } from 'services/utils';

import { useFetchLeaderboard } from 'redux/General/hooks';
import { useSelector } from 'redux/useSelector';
import { useDebouncedSearch } from 'services/useDebouncedSearch';
import { selectLeaderboard } from 'redux/General/selectors';
import { FormattedMessage, useIntl } from 'react-intl';
import HomeLayout from 'layout/HomeLayout';
import {
  StyledHeader,
  StyledScoreboard,
  ScoreboardWithFilter,
  FilterInput,
} from './Leaderboard.style';

const Leaderboard: React.FC<NoProps> = () => {
  const doFetchLeaderboard = useFetchLeaderboard();
  const leaderboard = useSelector(selectLeaderboard);
  const intl = useIntl();

  const useFilterLeaderboard = () =>
    useDebouncedSearch((filter: string) => {
      doFetchLeaderboard(1, filter, true);
    });
  const { inputText, setInputText } = useFilterLeaderboard();

  useEffect(() => {
    doFetchLeaderboard(1, '');
  }, [doFetchLeaderboard]);

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
          onScrollEnd={doFetchLeaderboard}
          list={formattedLeaderboard}
          showRankings
          filter={inputText}
        />
        <FilterInput
          type="text"
          placeholder={intl.formatMessage({ id: 'leaderboard.filterInput' })}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </ScoreboardWithFilter>
    </HomeLayout>
  );
};

export default Leaderboard;
