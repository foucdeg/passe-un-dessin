import React, { useEffect, useMemo } from 'react';
import { NoProps } from 'services/utils';

import GameContainer from 'layout/GameLayout/GameContainer';
import InnerGameContainer from 'layout/GameLayout/InnerGameContainer';

import { useFetchLeaderboard } from 'redux/General/hooks';
import { useSelector } from 'redux/useSelector';
import { useDebouncedSearch } from 'services/useDebouncedSearch';
import { selectLeaderboard } from 'redux/General/selectors';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Container,
  StyledHeader,
  StyledScoreboard,
  HomeButton,
  StyledLink,
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
    <>
      <StyledLink to="/">
        <HomeButton alt="Back to home" />
      </StyledLink>
      <GameContainer>
        <InnerGameContainer>
          <Container>
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
          </Container>
        </InnerGameContainer>
      </GameContainer>
    </>
  );
};

export default Leaderboard;
