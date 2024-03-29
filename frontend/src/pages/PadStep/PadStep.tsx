import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'redux/useSelector';
import { useParams } from 'react-router';
import { Game, StepType } from 'redux/Game/types';
import { useFetchStep, useSaveStepDrawing, useSaveStepSentence } from 'redux/Step/hooks';
import { selectStep } from 'redux/Step/selectors';
import Loader from 'atoms/Loader';
import WordToDrawingStep from './components/WordToDrawingStep';
import DrawingToWordStep from './components/DrawingToWordStep';
import InitStep from './components/InitStep/InitStep';

interface Props {
  game: Game;
}

interface RouteParams {
  stepId: string;
}

const PadStep: React.FunctionComponent<Props> = ({ game }) => {
  const step = useSelector(selectStep);
  const doFetchStep = useFetchStep();
  const [{ loading: isSaveStepDrawingLoading }, doSaveStepDrawing] = useSaveStepDrawing();
  const [{ loading: isSaveStepSentenceLoading }, doSaveStepSentence] = useSaveStepSentence();
  const { stepId } = useParams<keyof RouteParams>() as RouteParams;
  console.log('in PAdStep', stepId);

  useEffect(() => {
    if (stepId) {
      doFetchStep(stepId);
    }
  }, [doFetchStep, stepId]);

  const saveSentenceStep = useCallback(
    (sentence: string | null) => {
      if (!step) return;
      return doSaveStepSentence(step, sentence);
    },
    [doSaveStepSentence, step],
  );

  const saveDrawingStep = useCallback(
    (drawing: string) => {
      if (!step) return;
      return doSaveStepDrawing(step, drawing);
    },
    [doSaveStepDrawing, step],
  );

  if (!game || !step) {
    return <Loader />;
  }

  switch (step.step_type) {
    case StepType.DRAWING_TO_WORD:
      return (
        <DrawingToWordStep
          padStep={step}
          loading={isSaveStepSentenceLoading}
          saveStep={saveSentenceStep}
        />
      );
    case StepType.WORD_TO_DRAWING:
      return (
        <WordToDrawingStep
          padStep={step}
          loading={isSaveStepDrawingLoading}
          saveStep={saveDrawingStep}
        />
      );
    case StepType.INITIAL:
      return (
        <InitStep
          padStep={step}
          loading={isSaveStepSentenceLoading}
          saveStep={saveSentenceStep}
          drawOwnWord={game.draw_own_word}
        />
      );
  }
};

export default PadStep;
