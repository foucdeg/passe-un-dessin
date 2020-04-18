import React from 'react';
import { Pad, StepType } from 'redux/Game/types';
import { PadRecapRow, ArrowSpacer } from './PadRecap.style';
import SentenceRecap from 'components/SentenceRecap';
import DrawingRecap from 'components/DrawingRecap';

interface Props {
  pad: Pad;
}

const PadRecap: React.FC<Props> = ({ pad }) => (
  <PadRecapRow>
    <SentenceRecap
      sentence={pad.sentence}
      playerName={pad.initial_player.name}
      color={pad.initial_player.color}
      isInitial
    />
    {pad.steps.map(step => (
      <React.Fragment key={step.uuid}>
        <ArrowSpacer />
        {step.step_type === StepType.WORD_TO_DRAWING ? (
          <DrawingRecap drawing={step.drawing} playerName={step.player.name} />
        ) : (
          <SentenceRecap
            sentence={step.sentence}
            playerName={step.player.name}
            color={step.player.color}
          />
        )}
      </React.Fragment>
    ))}
  </PadRecapRow>
);

export default PadRecap;
