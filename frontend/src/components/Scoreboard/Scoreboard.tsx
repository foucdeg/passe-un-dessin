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
  isBig?: boolean;
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

const Scoreboard: React.FC<Props> = ({ list, className, isBig }) => (
  <InnerScoreboard className={className}>
    {list.map((playerWithScore, index) => (
      <RankingRow key={playerWithScore.uuid}>
        {isBig &&
          (index < 3 ? (
            <RankEmoji>{getRankDisplay(index)}</RankEmoji>
          ) : (
            <RankText>{index + 1}</RankText>
          ))}
        <StyledAvatar player={playerWithScore} />
        <BareLink
          to={PUBLIC_PATHS.PLAYER_DETAILS.replace(':playerId', playerWithScore.uuid)}
          target="_blank"
        >
          <PlayerName isBig={isBig}>{playerWithScore.name}</PlayerName>
        </BareLink>
        <Spacer />
        {playerWithScore.delta && <span>+ {playerWithScore.delta}</span>}
        <RankingScore isBig={isBig}>{playerWithScore.score}</RankingScore>
      </RankingRow>
    ))}
  </InnerScoreboard>
);
export default Scoreboard;
