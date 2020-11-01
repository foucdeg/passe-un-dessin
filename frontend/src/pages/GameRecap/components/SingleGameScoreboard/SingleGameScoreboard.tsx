import React from 'react';
import { FormattedMessage } from 'react-intl';
import Scoreboard from 'components/Scoreboard';
import { PlayerWithScore } from 'components/Scoreboard/Scoreboard';
import { PadStep } from 'redux/Game/types';
import { GameScoreboardContainer, StyledHeader } from './SingleGameScoreboard.style';

interface Props {
  winners: PadStep[];
}
const SingleGameScoreboard: React.FC<Props> = ({ winners }) => {
  if (!winners) return null;

  const winningPlayers = winners.reduce((acc, winningPadStep) => {
    const playerItemIndex = acc.findIndex(
      (playerWithScore) => playerWithScore.uuid === winningPadStep.player.uuid,
    );
    if (playerItemIndex === -1) {
      acc.push({
        ...winningPadStep.player,
        score: winningPadStep.votes.length,
      });
      return acc;
    }
    acc[playerItemIndex].score += winningPadStep.votes.length;
    return acc;
  }, [] as PlayerWithScore[]);

  const list = winningPlayers.sort((playerA, playerB) => playerB.score - playerA.score);

  return (
    <GameScoreboardContainer>
      <StyledHeader>
        <FormattedMessage id="voteResults.scoreboard" />
      </StyledHeader>
      <Scoreboard list={list} />
    </GameScoreboardContainer>
  );
};
export default SingleGameScoreboard;
