import React from 'react';
import { RootState } from 'redux/types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { StepType } from 'redux/Game/types';
import DrawingToWordStep from 'components/DrawingToWordStep';
import WordToDrawingStep from 'components/WordToDrawingStep';

const PadStep: React.FunctionComponent = () => {
  const { stepId } = useParams();
  const game = useSelector((state: RootState) => state.game.game);

  if (!game) return null;
  const padStep = game.rounds.find(padStep => padStep.uuid === stepId);
  if (!padStep) return null;

  return (
    <>
      <p>Bienvenue sur la step {padStep.uuid} !</p>
      {padStep.step_type === StepType.DRAWING_TO_WORD ? (
        <DrawingToWordStep padStep={padStep} />
      ) : (
        <WordToDrawingStep padStep={padStep} />
      )}
    </>
  );
};

export default PadStep;
