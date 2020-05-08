import React from 'react';
import lzString from 'lz-string';
import { FormattedMessage } from 'react-intl';
import CanvasRecap from 'components/Canvas/CanvasRecap';
import podiumsSteps from 'assets/podium-steps';

import { PadStep, StepType } from 'redux/Game/types';

import {
  Container,
  PlayerName,
  PodiumStepImage,
  Sentence,
  VoteCount,
  WinnerSection,
  ArrowSpacer,
} from './PodiumStep.style';

interface Props {
  winner?: PadStep;
  width: number;
  ranking: number;
}

const PodiumStep: React.FC<Props> = ({ winner, width, ranking }) => {
  const decodedWinnerDrawing =
    winner && winner.drawing ? lzString.decompressFromBase64(winner.drawing) : null;

  return (
    <Container width={width}>
      {winner && (
        <WinnerSection>
          {winner.step_type === StepType.WORD_TO_DRAWING && (
            <>
              <Sentence>{winner.sentence}</Sentence>
              <ArrowSpacer />
            </>
          )}
          <div style={{ height: width }}>
            <CanvasRecap width={width} height={width} saveData={decodedWinnerDrawing} hideBorder />
          </div>
          {winner.step_type === StepType.DRAWING_TO_WORD && (
            <>
              <ArrowSpacer highlighted />
              <Sentence highlighted>{winner.sentence}</Sentence>
            </>
          )}
          <PlayerName>{winner.player.name}</PlayerName>
          <VoteCount>
            <FormattedMessage
              id="voteResults.voteCount"
              values={{ voteCount: winner.votes.length }}
            />
          </VoteCount>
        </WinnerSection>
      )}
      <PodiumStepImage src={podiumsSteps[ranking - 1]} width={width} />
    </Container>
  );
};

export default PodiumStep;
