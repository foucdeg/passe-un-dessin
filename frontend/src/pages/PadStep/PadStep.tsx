import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'redux/useSelector';
import { useParams } from 'react-router';
import { StepType } from 'redux/Game/types';
import DrawingToWordStep from 'components/DrawingToWordStep';
import WordToDrawingStep from 'components/WordToDrawingStep';
import { useFetchStep, useSaveStepDrawing, useSaveStepSentence } from 'redux/Step/hooks';
import { getPreviousNextPlayersForStep } from 'services/game.service';
import { selectGame } from 'redux/Game/selectors';
import { selectStep } from 'redux/Step/selectors';

const PadStep: React.FunctionComponent = () => {
  const game = useSelector(selectGame);
  const step = useSelector(selectStep);
  const doFetchStep = useFetchStep();
  const [{ loading: isSaveStepDrawingLoading }, doSaveStepDrawing] = useSaveStepDrawing();
  const [{ loading: isSaveStepSentenceLoading }, doSaveStepSentence] = useSaveStepSentence();
  const { stepId } = useParams();

  useEffect(() => {
    if (stepId) {
      doFetchStep(stepId);
    }
  }, [doFetchStep, stepId]);

  const saveStep = useCallback(
    (values: { sentence?: string; drawing?: string }) => {
      if (!step) return;

      if (values.sentence && !isSaveStepSentenceLoading) {
        doSaveStepSentence({ step, sentence: values.sentence });
      }
      if (values.drawing && !isSaveStepDrawingLoading) {
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

  const [previousPlayer, nextPlayer] = getPreviousNextPlayersForStep(game, step);

  return step.step_type === StepType.DRAWING_TO_WORD ? (
    <DrawingToWordStep
      padStep={step}
      loading={isSaveStepSentenceLoading}
      saveStep={saveStep}
      previousPlayer={previousPlayer}
      nextPlayer={nextPlayer}
    />
  ) : (
    <WordToDrawingStep
      padStep={step}
      loading={isSaveStepDrawingLoading}
      saveStep={saveStep}
      previousPlayer={previousPlayer}
      nextPlayer={nextPlayer}
    />
  );
};

export default PadStep;
