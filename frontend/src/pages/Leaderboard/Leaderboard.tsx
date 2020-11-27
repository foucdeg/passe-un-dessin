import React, { useEffect, useState } from 'react';
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

  const fetchNextPage = () => {
    if (leaderboard.length === page * 10) {
      setPage(page + 1);
      doFetchLeaderboard(page + 1);
    }
  };

  if (!leaderboard) {
    return (
      <GameContainer>
        <InnerGameContainer>
          <Container />
        </InnerGameContainer>
      </GameContainer>
    );
  }

  const formattedLeaderboard = leaderboard.map((item) => ({ ...item, score: item.vote_count }));

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
            {leaderboard && (
              <StyledScoreboard
                onScrollEnd={fetchNextPage}
                list={formattedLeaderboard}
                showRankings
              />
            )}
          </Container>
        </InnerGameContainer>
      </GameContainer>
    </>
  );
};

export default Leaderboard;
