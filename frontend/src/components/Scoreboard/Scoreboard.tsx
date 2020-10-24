import React from 'react';
import Spacer from 'atoms/Spacer';
import { Player } from 'redux/Player/types';
import BareLink from 'atoms/BareLink';
import { PUBLIC_PATHS } from 'routes';
import {
  InnerScoreboard,
  RankingRow,
  RankText,
  RankEmoji,
  RankingScore,
  RankingDelta,
  StyledPlayeChip,
} from './Scoreboard.style';

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
        <StyledPlayeChip color={playerWithScore.color}>
          <BareLink
            to={PUBLIC_PATHS.PLAYER_DETAILS.replace(':playerId', playerWithScore.uuid)}
            target="_blank"
          >
            {playerWithScore.name}
          </BareLink>
        </StyledPlayeChip>
        <Spacer />
        {playerWithScore.delta && <RankingDelta>+ {playerWithScore.delta}</RankingDelta>}
        <RankingScore>{playerWithScore.score}</RankingScore>
      </RankingRow>
    ))}
  </InnerScoreboard>
);
export default Scoreboard;
