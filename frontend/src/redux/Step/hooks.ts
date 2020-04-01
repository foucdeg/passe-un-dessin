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
  return useAsyncFn(async (stepId: string, drawing: string) => {
    await client.put(`/pad-step/${stepId}/save`, { drawing });
  });
};

export const useSaveStepSentence = () => {
  /* eslint-disable-next-line @typescript-eslint/ban-ts-ignore */
  // @ts-ignore
  return useAsyncFn(async (stepId: string, sentence: string) => {
    await client.put(`/pad-step/${stepId}/save`, { sentence });
  });
};
