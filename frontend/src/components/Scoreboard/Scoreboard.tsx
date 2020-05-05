import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  ScoreboardContainer,
  StyledHeader,
  RankingRow,
  RankEmoji,
  RankingScore,
  RankingDelta,
  StyledPlayeChip,
} from './Scoreboard.style';
import Spacer from 'atoms/Spacer';
import { useSelector } from 'redux/useSelector';
import { selectRanking } from 'redux/Room/selectors';
import { selectWinners } from 'redux/Game/selectors';

type Deltas = {
  [playerId: string]: number;
};

const getRankEmoji = (ranking: number) => {
  switch (ranking) {
    case 0:
      return '🏆';
    case 1:
      return '🥈';
    case 2:
      return '🥉';
    default:
      return '';
  }
};

const Scoreboard: React.FC<{}> = () => {
  const ranking = useSelector(selectRanking);
  const winners = useSelector(selectWinners);

  if (!ranking || !winners) return null;

  const deltas = winners.reduce((currentDeltas, winningPadStep) => {
    return {
      ...currentDeltas,
      [winningPadStep.player.uuid]:
        (currentDeltas[winningPadStep.player.uuid] || 0) + winningPadStep.votes.length,
    };
  }, {} as Deltas);

  return (
    <ScoreboardContainer>
      <StyledHeader>
        <FormattedMessage id="voteResults.scoreboard" />
      </StyledHeader>
      {ranking.map((playerRanking, index) => {
        const delta = deltas[playerRanking.player.uuid];

        return (
          <RankingRow key={playerRanking.player.uuid}>
            <RankEmoji>{getRankEmoji(index)}</RankEmoji>
            <StyledPlayeChip color={playerRanking.player.color}>
              {playerRanking.player.name}
            </StyledPlayeChip>
            <Spacer />
            {delta && <RankingDelta>+ {delta}</RankingDelta>}
            <RankingScore>{playerRanking.vote_count}</RankingScore>
          </RankingRow>
        );
      })}
    </ScoreboardContainer>
  );
};
export default Scoreboard;
