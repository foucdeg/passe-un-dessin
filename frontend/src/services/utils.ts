import { useAsyncFn } from 'react-use';
import { AsyncFnReturn } from 'react-use/lib/useAsync';

export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function useTypedAsyncFn<T>(
  callback: (input: T) => Promise<any>,
  deps: any[],
): AsyncFnReturn {
  return useAsyncFn(async (...args: T[]) => {
    await callback(args[0]);
  }, deps);
}

export type EmptyObject = Omit<Record<any, never>, keyof any>;
/* eslint-enable @typescript-eslint/no-explicit-any */
export type NoProps = EmptyObject;

const emailRegexp = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

export const isValidEmail = (input: string) => !!input.match(emailRegexp);
