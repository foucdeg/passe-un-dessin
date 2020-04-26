import { useAsyncFn } from 'react-use';

export async function wait(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function useTypedAsyncFn<T>(callback: (input: T) => Promise<any>) {
  return useAsyncFn(async (...args: T[]) => {
    await callback(args[0]);
  });
}
