import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'redux/useSelector';
import { useParams } from 'react-router';
import { StepType } from 'redux/Game/types';
import { useFetchStep, useSaveStepDrawing, useSaveStepSentence } from 'redux/Step/hooks';
import { selectGame } from 'redux/Game/selectors';
import { selectStep } from 'redux/Step/selectors';
import WordToDrawingStep from './components/WordToDrawingStep';
import DrawingToWordStep from './components/DrawingToWordStep';

interface RouteParams {
  stepId: string;
}

const PadStep: React.FunctionComponent = () => {
  const game = useSelector(selectGame);
  const step = useSelector(selectStep);
  const doFetchStep = useFetchStep();
  const [{ loading: isSaveStepDrawingLoading }, doSaveStepDrawing] = useSaveStepDrawing();
  const [{ loading: isSaveStepSentenceLoading }, doSaveStepSentence] = useSaveStepSentence();
  const { stepId } = useParams<RouteParams>();

  useEffect(() => {
    if (stepId) {
      doFetchStep(stepId);
    }
  }, [doFetchStep, stepId]);

  const saveStep = useCallback(
    (values: { sentence?: string | null; drawing?: string }) => {
      if (!step) return;

      if (values.sentence !== undefined && !isSaveStepSentenceLoading) {
        doSaveStepSentence({ step, sentence: values.sentence });
      }
      if (values.drawing !== undefined && !isSaveStepDrawingLoading) {
        doSaveStepDrawing({ step, drawing: values.drawing });
      }
    },
    [
      doSaveStepDrawing,
      doSaveStepSentence,
      isSaveStepDrawingLoading,
      isSaveStepSentenceLoading,
      step,
    ],
  );

  if (!game) return null;
  if (!step) return null;

  return step.step_type === StepType.DRAWING_TO_WORD ? (
    <DrawingToWordStep padStep={step} loading={isSaveStepSentenceLoading} saveStep={saveStep} />
  ) : (
    <WordToDrawingStep padStep={step} loading={isSaveStepDrawingLoading} saveStep={saveStep} />
  );
};

export default PadStep;
