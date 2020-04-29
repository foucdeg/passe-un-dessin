import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Container, Sentence, PlayerName, VoteCount } from './PodiumStep.style';
import { PadStep } from 'redux/Game/types';
import lzString from 'lz-string';
import CanvasDraw from 'react-canvas-draw';

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
      <CanvasDraw
        disabled
        canvasWidth={width - 10}
        canvasHeight={width - 10}
        hideGrid
        saveData={lzString.decompressFromBase64(winner.drawing)}
      />
      <PlayerName>{winner.player.name}</PlayerName>
      <VoteCount>
        <FormattedMessage id="podium.voteCount" values={{ voteCount: winner.votes.length }} />
      </VoteCount>
    </Container>
  );
};

export default PodiumStep;
