import client from 'services/networking/client';
import { useDispatch } from 'react-redux';
import { updateStep } from './slice';
import { useCallback } from 'react';
import { PadStep } from 'redux/Game/types';

export const useFetchStep = () => {
  const dispatch = useDispatch();

  return useCallback(
    async (stepId: string) => {
      const step = await client.get(`/pad-step/${stepId}`);
      dispatch(updateStep(step));
    },
    [dispatch],
  );
};

export const useSaveStepDrawing = () => {
  return useCallback(async (step: PadStep, drawing: string) => {
    await client.put(`/pad-step/${step.uuid}/save`, { drawing });
  }, []);
};

export const useSaveStepSentence = () => {
  const dispatch = useDispatch();

  return useCallback(
    async (step: PadStep, sentence: string) => {
      await client.put(`/pad-step/${step.uuid}/save`, { sentence });
      dispatch(
        updateStep({
          ...step,
          sentence,
        }),
      );
    },
    [dispatch],
  );
};
