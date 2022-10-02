import React, { useEffect, useRef } from 'react';
import Spacer from 'atoms/Spacer';
import { Player } from 'redux/Player/types';
import { PUBLIC_PATHS } from 'routes';
import {
  InnerScoreboard,
  LinkedRankingRow,
  RankingRow,
  RankText,
  RankingDelta,
  RankingScore,
  PlayerText,
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
  links?: boolean;
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

const Scoreboard: React.FC<Props> = ({ list, className, showRankings, onScrollEnd, links }) => {
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
      onScrollEnd();
    }
  }, [onScrollEnd]);

  const RankingRowComponent: React.FC<{
    playerWithScore: PlayerWithScore;
    children: React.ReactNode;
  }> = ({ playerWithScore, children }) => {
    if (links) {
      return (
        <LinkedRankingRow
          data-test="ranking-row"
          to={PUBLIC_PATHS.PLAYER_DETAILS.replace(':playerId', playerWithScore.uuid)}
        >
          {children}
        </LinkedRankingRow>
      );
    }

    return <RankingRow data-test="ranking-row">{children}</RankingRow>;
  };

  return (
    <InnerScoreboard
      ref={scoreBoardRef}
      onScroll={onScroll}
      className={className}
      data-test="scoreboard"
    >
      {list.map((playerWithScore, index) => (
        <RankingRowComponent key={playerWithScore.uuid} playerWithScore={playerWithScore}>
          {showRankings && <RankText>{getRankDisplay(playerWithScore.rank || index + 1)}</RankText>}
          <StyledAvatar player={playerWithScore} />
          <PlayerText>{playerWithScore.name}</PlayerText>
          <Spacer />
          {playerWithScore.delta && <RankingDelta>+ {playerWithScore.delta}</RankingDelta>}
          <RankingScore>{playerWithScore.score}</RankingScore>
        </RankingRowComponent>
      ))}
    </InnerScoreboard>
  );
};
export default Scoreboard;
