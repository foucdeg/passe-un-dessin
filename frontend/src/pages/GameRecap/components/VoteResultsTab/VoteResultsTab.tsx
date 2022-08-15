import React, { useEffect } from 'react';

import Podium from 'pages/VoteResults/components/Podium';
import { usePublicVoteResults } from 'redux/Game/hooks';
import Loader from 'atoms/Loader';
import { Game } from 'redux/Game/types';
import SingleGameScoreboard from '../SingleGameScoreboard';
import { VoteResultsTabContainer } from './VoteResultsTab.style';

const VoteResultsTab: React.FC<{ game: Game }> = ({ game }) => {
  const [{ value: winners, loading }, doGetVoteResults] = usePublicVoteResults(game.uuid);

  useEffect(() => {
    doGetVoteResults();
  }, [doGetVoteResults, game]);

  if (loading || !winners) {
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
