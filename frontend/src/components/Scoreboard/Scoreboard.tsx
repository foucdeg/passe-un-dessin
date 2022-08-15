import React, { useEffect, useRef } from 'react';
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
  rank?: number;
};

interface Props {
  list: PlayerWithScore[];
  className?: string;
  showRankings?: boolean;
  filter?: string;
  onScrollEnd?: () => void;
}
const getRankDisplay = (ranking: number) => {
  switch (ranking) {
    case 1:
      return '🏆';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return ranking;
  }
};

const Scoreboard: React.FC<Props> = ({ list, className, showRankings, onScrollEnd }) => {
  const scoreBoardRef = useRef<HTMLDivElement>(null);
  const onScroll = () => {
    if (!scoreBoardRef || !scoreBoardRef.current) return;
    if (!onScrollEnd) return;
    if (
      scoreBoardRef.current.scrollTop + scoreBoardRef.current.offsetHeight >=
      scoreBoardRef.current.scrollHeight - 100
    ) {
      onScrollEnd();
    }
  };

  // Fetch more pages until component is taller than avilable space
  useEffect(() => {
    if (!scoreBoardRef || !scoreBoardRef.current) return;
    if (!onScrollEnd) return;

    const childrenHeight = Array.from(scoreBoardRef.current.children).reduce(
      (acc, child) => acc + child.clientHeight,
      0,
    );

    if (childrenHeight <= scoreBoardRef.current.offsetHeight) {
      console.log('would call onScrollEnd', childrenHeight, scoreBoardRef.current.offsetHeight);
      onScrollEnd();
    }
  }, [onScrollEnd]);

  return (
    <InnerScoreboard
      ref={scoreBoardRef}
      onScroll={onScroll}
      className={className}
      data-test="scoreboard"
    >
      {list.map((playerWithScore, index) => (
        <RankingRow key={playerWithScore.uuid} data-test="ranking-row">
          {showRankings && <RankText>{getRankDisplay(playerWithScore.rank || index + 1)}</RankText>}
          <StyledAvatar player={playerWithScore} />
          <StyledLink
            to={PUBLIC_PATHS.PLAYER_DETAILS.replace(':playerId', playerWithScore.uuid)}
            target="_blank"
            rel="noreferrer"
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
};
export default Scoreboard;
