import React from 'react';
import Spacer from 'atoms/Spacer';
import { Player } from 'redux/Player/types';
import { PUBLIC_PATHS } from 'routes';
import {
  InnerScoreboard,
  RankingRow,
  RankText,
  RankingDelta,
  RankingScore,
  StyledLink,
  StyledAvatar,
} from './Scoreboard.style';

export type PlayerWithScore = Player & {
  score: number;
  delta?: number;
};

interface Props {
  list: PlayerWithScore[];
  className?: string;
  showRankings?: boolean;
}
const getRankDisplay = (ranking: number) => {
  switch (ranking) {
    case 0:
      return '🏆';
    case 1:
      return '🥈';
    case 2:
      return '🥉';
    default:
      return ranking + 1;
  }
};

const Scoreboard: React.FC<Props> = ({ list, className, showRankings }) => (
  <InnerScoreboard className={className}>
    {list.map((playerWithScore, index) => (
      <RankingRow key={playerWithScore.uuid}>
        {showRankings && <RankText>{getRankDisplay(index)}</RankText>}
        <StyledAvatar player={playerWithScore} />
        <StyledLink
          to={PUBLIC_PATHS.PLAYER_DETAILS.replace(':playerId', playerWithScore.uuid)}
          target="_blank"
        >
          {playerWithScore.name}
        </StyledLink>
        <Spacer />
        {playerWithScore.delta && <RankingDelta>+ {playerWithScore.delta}</RankingDelta>}
        <RankingScore>{playerWithScore.score}</RankingScore>
      </RankingRow>
    ))}
  </InnerScoreboard>
);
export default Scoreboard;
