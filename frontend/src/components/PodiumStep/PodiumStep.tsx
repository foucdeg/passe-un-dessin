import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Container,
  Sentence,
  PlayerName,
  VoteCount,
  WinnerSection,
  PodiumStepImage,
} from './PodiumStep.style';
import { PadStep } from 'redux/Game/types';
import lzString from 'lz-string';
import CanvasDraw from 'react-canvas-draw';
import Spacer from 'atoms/Spacer';
import podiumsSteps from 'assets/podium-steps';

interface Props {
  winner?: PadStep;
  width: number;
  ranking: number;
}

const PodiumStep: React.FC<Props> = ({ winner, width, ranking }) => {
  return (
    <Container>
      <Spacer />
      {winner && (
        <WinnerSection>
          <Sentence>{winner.sentence}</Sentence>
          <CanvasDraw
            disabled
            canvasWidth={width}
            canvasHeight={width}
            hideGrid
            saveData={lzString.decompressFromBase64(winner.drawing)}
          />
          <PlayerName>{winner.player.name}</PlayerName>
          <VoteCount>
            <FormattedMessage id="podium.voteCount" values={{ voteCount: winner.votes.length }} />
          </VoteCount>
        </WinnerSection>
      )}
      <PodiumStepImage src={podiumsSteps[ranking - 1]} width={width} />
    </Container>
  );
};

export default PodiumStep;
