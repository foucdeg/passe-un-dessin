import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Container, Sentence, PlayerName, VoteCount } from './PodiumStep.style';
import { PadStep } from 'redux/Game/types';
import DrawingRecap from 'components/DrawingRecap';

interface Props {
  winner: PadStep;
  bottom: number;
  left: number;
  width: number;
  height: number;
}

const PodiumStep: React.FC<Props> = ({ winner, bottom, left, width, height }) => {
  return (
    <Container bottom={bottom} left={left} width={width} height={height}>
      <Sentence>{winner.sentence}</Sentence>
      <DrawingRecap hidePlayerName hideBorder step={winner} width={width - 10} />
      <PlayerName>{winner.player.name}</PlayerName>
      <VoteCount>
        <FormattedMessage id="podium.voteCount" values={{ voteCount: winner.votes.length }} />
      </VoteCount>
    </Container>
  );
};

export default PodiumStep;
