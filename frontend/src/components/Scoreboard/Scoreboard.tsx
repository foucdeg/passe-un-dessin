import React from 'react';
import Spacer from 'atoms/Spacer';
import { Player } from 'redux/Player/types';
import BareLink from 'atoms/BareLink';
import { PUBLIC_PATHS } from 'routes';
import {
  InnerScoreboard,
  RankingRow,
  RankText,
  RankingScore,
  StyledAvatar,
  PlayerName,
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
        <BareLink
          to={PUBLIC_PATHS.PLAYER_DETAILS.replace(':playerId', playerWithScore.uuid)}
          target="_blank"
        >
          <PlayerName>{playerWithScore.name}</PlayerName>
        </BareLink>
        <Spacer />
        {playerWithScore.delta && <span>+ {playerWithScore.delta}</span>}
        <RankingScore>{playerWithScore.score}</RankingScore>
      </RankingRow>
    ))}
  </InnerScoreboard>
);
export default Scoreboard;
