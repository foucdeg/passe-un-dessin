import React, { useEffect, useCallback } from 'react';
import { RootState } from 'redux/types';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { StepType } from 'redux/Game/types';
import DrawingToWordStep from 'components/DrawingToWordStep';
import WordToDrawingStep from 'components/WordToDrawingStep';
import { useFetchStep, useSaveStepDrawing, useSaveStepSentence } from 'redux/Step/hooks';

const PadStep: React.FunctionComponent = () => {
  const game = useSelector((state: RootState) => state.game.game);
  const step = useSelector((state: RootState) => state.step.step);
  const [, doFetchStep] = useFetchStep();
  const [, doSaveStepDrawing] = useSaveStepDrawing();
  const [, doSaveStepSentence] = useSaveStepSentence();
  const { stepId } = useParams();

  useEffect(() => {
    doFetchStep(stepId);
  }, [doFetchStep, stepId]);

  const saveStep = useCallback(
    (values: { sentence?: string; drawing?: string }) => {
      if (!step) return;

      if (values.sentence) {
        doSaveStepSentence(step, values.sentence);
      }
      if (values.drawing) {
        doSaveStepDrawing(step, values.drawing);
      }
    },
    [doSaveStepDrawing, doSaveStepSentence, step],
  );

  if (!game) return null;
  if (!step) return null;

  return (
    <>
      {step.step_type === StepType.DRAWING_TO_WORD ? (
        <DrawingToWordStep padStep={step} saveStep={saveStep} />
      ) : (
        <WordToDrawingStep padStep={step} saveStep={saveStep} />
      )}
    </>
  );
};

export default PadStep;
