import { useAsyncFn } from 'react-use';
import client from 'services/networking/client';
import { useDispatch } from 'react-redux';
import { updateStep } from './slice';

export const useFetchStep = () => {
  const dispatch = useDispatch();
  /* eslint-disable-next-line @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return useAsyncFn(async (stepId: string) => {
    const step = await client.get(`/pad-step/${stepId}`);
    dispatch(updateStep(step));
  });
};

export const useSaveStepDrawing = () => {
  /* eslint-disable-next-line @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return useAsyncFn(async (step: PadStep, drawing: string) => {
    await client.put(`/pad-step/${step.uuid}/save`, { drawing });
  });
};

export const useSaveStepSentence = () => {
  const dispatch = useDispatch();
  /* eslint-disable-next-line @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return useAsyncFn(async (step: PadStep, sentence: string) => {
    await client.put(`/pad-step/${step.uuid}/save`, { sentence });
    dispatch(
      updateStep({
        ...step,
        sentence,
      }),
    );
  });
};
