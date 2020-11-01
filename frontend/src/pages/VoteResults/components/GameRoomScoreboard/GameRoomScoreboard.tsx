import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'redux/useSelector';
import { selectRanking } from 'redux/Room/selectors';
import { selectWinners } from 'redux/Game/selectors';
import { EmptyObject } from 'services/utils';
import Scoreboard from 'components/Scoreboard';
import { GameScoreboardContainer, StyledHeader } from './GameRoomScoreboard.style';

const GameRoomScoreboard: React.FC<EmptyObject> = () => {
  const ranking = useSelector(selectRanking);
  const winners = useSelector(selectWinners);

  if (!ranking || !winners) return null;

  const list = ranking.map((rankingItem) => {
    const winnerPadSteps = winners.filter(
      (winningPadStep) => winningPadStep.player.uuid === rankingItem.player.uuid,
    );
    const delta = winnerPadSteps.reduce((acc, padStep) => acc + padStep.votes.length, 0);

    return {
      ...rankingItem.player,
      score: rankingItem.vote_count,
      delta,
    };
  });

  return (
    <GameScoreboardContainer>
      <StyledHeader>
        <FormattedMessage id="voteResults.scoreboard" />
      </StyledHeader>
      <Scoreboard list={list} />
    </GameScoreboardContainer>
  );
};
export default GameRoomScoreboard;
