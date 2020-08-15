import React from 'react';
import {
  InnerScoreboard,
  RankingRow,
  RankText,
  RankEmoji,
  RankingScore,
  RankingDelta,
  StyledPlayeChip,
} from './Scoreboard.style';
import Spacer from 'atoms/Spacer';
import { Player } from 'redux/Player/types';

type PlayerWithScore = Player & {
  score: number;
  delta?: number;
};

interface Props {
  list: PlayerWithScore[];
  className?: string;
}
const getRankDisplay = (ranking: number) => {
  switch (ranking) {
    case 0:
      return '🏆';
    case 1:
      return '🥈';
    case 2:
      return '🥉';
  }
};

const Scoreboard: React.FC<Props> = ({ list, className }) => (
  <InnerScoreboard className={className}>
    {list.map((playerWithScore, index) => (
      <RankingRow key={playerWithScore.uuid}>
        {index < 3 ? (
          <RankEmoji>{getRankDisplay(index)}</RankEmoji>
        ) : (
          <RankText>{index + 1}</RankText>
        )}
        <StyledPlayeChip color={playerWithScore.color}>{playerWithScore.name}</StyledPlayeChip>
        <Spacer />
        {playerWithScore.delta && <RankingDelta>+ {playerWithScore.delta}</RankingDelta>}
        <RankingScore>{playerWithScore.score}</RankingScore>
      </RankingRow>
    ))}
  </InnerScoreboard>
);
export default Scoreboard;
