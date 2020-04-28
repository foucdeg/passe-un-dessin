import React from 'react';
import { Pad, StepType } from 'redux/Game/types';
import { PadRecapRow, ArrowSpacer } from './PadRecap.style';
import SentenceRecap from 'components/SentenceRecap';
import DrawingRecap from 'components/DrawingRecap';
import { selectPlayer } from 'redux/Player/selectors';
import { useSelector } from 'redux/useSelector';

interface Props {
  pad: Pad;
}

const PadRecap: React.FC<Props> = ({ pad }) => {
  const player = useSelector(selectPlayer);
  return (
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
            <DrawingRecap
              width={236}
              step={step}
              enableVote={player && step.player.uuid !== player.uuid}
            />
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
};

export default PadRecap;
