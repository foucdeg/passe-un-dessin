import React from 'react';
import { Pad, StepType } from 'redux/Game/types';
import { PadRecapColumn } from './PadRecap.style';
import SentenceRecap from 'components/SentenceRecap';
import DrawingRecap from 'components/DrawingRecap';

interface Props {
  pad: Pad;
}

const PadRecap: React.FC<Props> = ({ pad }) => (
  <PadRecapColumn>
    <h3>Carnet de {pad.initial_player.name}</h3>
    <SentenceRecap sentence={pad.sentence} playerName={pad.initial_player.name} isInitial />
    {pad.steps.map(step =>
      step.step_type === StepType.WORD_TO_DRAWING ? (
        <DrawingRecap key={step.uuid} drawing={step.drawing} playerName={step.player.name} />
      ) : (
        <SentenceRecap key={step.uuid} sentence={step.sentence} playerName={step.player.name} />
      ),
    )}
  </PadRecapColumn>
);

export default PadRecap;
