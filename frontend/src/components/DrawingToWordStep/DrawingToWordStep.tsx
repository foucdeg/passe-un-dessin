import React from 'react';
import { PadStep } from 'redux/Game/types';

interface Props {
  padStep: PadStep;
  saveStep: (values: { sentence?: string; drawing?: string }) => void;
}

const DrawingToWordStep: React.FC<Props> = ({ padStep, saveStep }) => {
  return (
    <>
      <p>This is a DrawingToWord step. {padStep.round_number}</p>
    </>
  );
};

export default DrawingToWordStep;
