import React, { useEffect, useMemo } from 'react';
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

  useEffect(() => {
    doFetchLeaderboard(1);
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
            <StyledScoreboard
              onScrollEnd={doFetchLeaderboard}
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
