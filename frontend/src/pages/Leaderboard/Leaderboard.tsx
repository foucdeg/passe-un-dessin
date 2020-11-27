import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { NoProps } from 'services/utils';

import GameContainer from 'layout/GameLayout/GameContainer';
import InnerGameContainer from 'layout/GameLayout/InnerGameContainer';

import { useFetchLeaderboard } from 'redux/General/hooks';
import { useSelector } from 'redux/useSelector';
import { selectLeaderboard } from 'redux/General/selectors';
import { FormattedMessage } from 'react-intl';
import {
  Container,
  StyledHeader,
  StyledScoreboard,
  HomeButton,
  StyledLink,
} from './Leaderboard.style';

const Leaderboard: React.FC<NoProps> = () => {
  const doFetchLeaderboard = useFetchLeaderboard();
  const leaderboard = useSelector(selectLeaderboard);
  const [page, setPage] = useState(1);

  useEffect(() => {
    doFetchLeaderboard(page);
  }, [doFetchLeaderboard, page]);

  const fetchNextPage = useCallback(() => {
    if (Object.keys(leaderboard).length === page * 10) {
      setPage(page + 1);
      doFetchLeaderboard(page + 1);
    }
  }, [doFetchLeaderboard, leaderboard, page, setPage]);

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
            <StyledScoreboard
              onScrollEnd={fetchNextPage}
              list={formattedLeaderboard}
              showRankings
            />
          </Container>
        </InnerGameContainer>
      </GameContainer>
    </>
  );
};

export default Leaderboard;
