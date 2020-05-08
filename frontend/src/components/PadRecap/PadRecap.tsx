import React from 'react';
import { Pad, StepType, PadStep } from 'redux/Game/types';
import { PadRecapRow, ArrowSpacer } from './PadRecap.style';
import SentenceRecap from 'components/SentenceRecap';
import DrawingRecap from 'components/DrawingRecap';

interface Props {
  pad: Pad;
}

const PadRecap: React.FC<Props> = ({ pad }) => {
  const initialStep: PadStep = {
    uuid: pad.uuid,
    sentence: pad.sentence,
    player: pad.initial_player,
    step_type: StepType.DRAWING_TO_WORD,
    votes: [],
    round_number: -1,
    drawing: null,
  };

  return (
    <PadRecapRow>
      <SentenceRecap step={initialStep} />
      {pad.steps.map(step => (
        <React.Fragment key={step.uuid}>
          <ArrowSpacer />
          {step.step_type === StepType.WORD_TO_DRAWING ? (
            <DrawingRecap step={step} />
          ) : (
            <SentenceRecap step={step} />
          )}
        </React.Fragment>
      ))}
    </PadRecapRow>
  );
};

export default PadRecap;
