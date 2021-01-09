import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'redux/useSelector';
import { useParams } from 'react-router';
import { StepType } from 'redux/Game/types';
import { useFetchStep, useSaveStepDrawing, useSaveStepSentence } from 'redux/Step/hooks';
import { selectGame } from 'redux/Game/selectors';
import { selectStep } from 'redux/Step/selectors';
import WordToDrawingStep from './components/WordToDrawingStep';
import DrawingToWordStep from './components/DrawingToWordStep';
import InitStep from './components/InitStep/InitStep';

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
        doSaveStepSentence(step, values.sentence);
      }
      if (values.drawing !== undefined && !isSaveStepDrawingLoading) {
        doSaveStepDrawing(step, values.drawing);
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

  switch (step.step_type) {
    case StepType.DRAWING_TO_WORD:
      return (
        <DrawingToWordStep padStep={step} loading={isSaveStepSentenceLoading} saveStep={saveStep} />
      );
    case StepType.WORD_TO_DRAWING:
      return (
        <WordToDrawingStep padStep={step} loading={isSaveStepDrawingLoading} saveStep={saveStep} />
      );
    case StepType.INITIAL:
      return (
        <InitStep
          padStep={step}
          loading={isSaveStepDrawingLoading}
          saveStep={saveStep}
          drawOwnWord={game.draw_own_word}
        />
      );
  }
};

export default PadStep;
