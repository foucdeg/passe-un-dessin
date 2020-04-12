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
  const doSaveStepDrawing = useSaveStepDrawing();
  const doSaveStepSentence = useSaveStepSentence();
  const { stepId } = useParams();

  useEffect(() => {
    if (stepId) {
      doFetchStep(stepId);
    }
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

  const [previousPlayer, nextPlayer] = getPreviousNextPlayersForStep(game, step);

  return step.step_type === StepType.DRAWING_TO_WORD ? (
    <DrawingToWordStep
      padStep={step}
      saveStep={saveStep}
      previousPlayer={previousPlayer}
      nextPlayer={nextPlayer}
    />
  ) : (
    <WordToDrawingStep
      padStep={step}
      saveStep={saveStep}
      previousPlayer={previousPlayer}
      nextPlayer={nextPlayer}
    />
  );
};

export default PadStep;
