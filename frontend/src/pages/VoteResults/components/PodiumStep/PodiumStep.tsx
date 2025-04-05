import React from 'react';
import { FormattedMessage } from 'react-intl';
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
  HighlightedArrowSpacer,
  LightBulb,
  StyledDrawing,
} from './PodiumStep.style';

interface Props {
  winner?: PadStep;
  width: number;
  ranking: number;
}

const WordToDrawingStepWinner: React.FC<{ step: PadStep }> = ({ step }) => (
  <>
    <Sentence>{step.sentence}</Sentence>
    <ArrowSpacer />
    <StyledDrawing src={step.drawing_url} />
  </>
);

const DrawingToWordStepWinner: React.FC<{ step: PadStep }> = ({ step }) => (
  <>
    <StyledDrawing src={step.drawing_url} />
    <HighlightedArrowSpacer />
    <Sentence highlighted>{step.sentence}</Sentence>
  </>
);

const InitialStepWinner: React.FC<{ step: PadStep }> = ({ step }) => (
  <>
    <LightBulb>💡</LightBulb>
    <Sentence highlighted>{step.sentence}</Sentence>
  </>
);

const PodiumStep: React.FC<Props> = ({ winner, width, ranking }) => {
  return (
    <Container width={width}>
      {winner && (
        <WinnerSection>
          {winner.step_type === StepType.WORD_TO_DRAWING && (
            <WordToDrawingStepWinner step={winner} />
          )}
          {winner.step_type === StepType.DRAWING_TO_WORD && (
            <DrawingToWordStepWinner step={winner} />
          )}
          {winner.step_type === StepType.INITIAL && <InitialStepWinner step={winner} />}
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
