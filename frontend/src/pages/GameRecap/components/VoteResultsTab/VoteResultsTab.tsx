import React, { useEffect } from 'react';

import Podium from 'pages/VoteResults/components/Podium';
import { useGetVoteResults } from 'redux/Game/hooks';
import { selectGame, selectWinners } from 'redux/Game/selectors';
import { useSelector } from 'redux/useSelector';
import { NoProps } from 'services/utils';
import Loader from 'atoms/Loader';
import SingleGameScoreboard from '../SingleGameScoreboard';
import { VoteResultsTabContainer } from './VoteResultsTab.style';

const VoteResultsTab: React.FC<NoProps> = () => {
  const game = useSelector(selectGame);
  const winners = useSelector(selectWinners);

  const doGetVoteResults = useGetVoteResults();

  useEffect(() => {
    if (game) {
      doGetVoteResults(game.uuid);
    }
  }, [doGetVoteResults, game]);

  if (!game || !winners) {
    return <Loader />;
  }

  return (
    <VoteResultsTabContainer>
      {winners.length ? <Podium winners={winners} /> : <div>No votes</div>}
      <SingleGameScoreboard winners={winners} />
    </VoteResultsTabContainer>
  );
};

export default VoteResultsTab;
