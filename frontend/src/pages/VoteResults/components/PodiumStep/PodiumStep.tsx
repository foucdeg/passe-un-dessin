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
} from './PodiumStep.style';
import { StyledDrawing } from './PodiumStep.style';

interface Props {
  winner?: PadStep;
  width: number;
  ranking: number;
}

const PodiumStep: React.FC<Props> = ({ winner, width, ranking }) => {
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
          <StyledDrawing src={winner?.drawing_url} />
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
