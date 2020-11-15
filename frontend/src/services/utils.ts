import * as Sentry from '@sentry/browser';
import { useCallback, useState } from 'react';
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
    try {
      return await callback(args[0]);
    } catch (err) {
      Sentry.captureException(err);
      throw err;
    }
  }, deps);
}

export type EmptyObject = Omit<Record<any, never>, keyof any>;
/* eslint-enable @typescript-eslint/no-explicit-any */
export type NoProps = EmptyObject;

const emailRegexp = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

export const isValidEmail = (input: string) => !!input.match(emailRegexp);

const MAC_OS_PLATFORMS = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];

const isDeviceMacOs = () => MAC_OS_PLATFORMS.includes(window.navigator.platform);

const isCtrlOrCmdPressed = (event: KeyboardEvent) => {
  if (isDeviceMacOs()) {
    return event.metaKey;
  }
  return event.ctrlKey;
};

const isRedoKeyPadTouched = (event: KeyboardEvent) => {
  if (isDeviceMacOs()) {
    return event.key === 'Z';
  }
  return event.key === 'y';
};

export const undoAndRedoHandlerBuilder = (undoAction: () => void, redoAction: () => void) => (
  event: KeyboardEvent,
) => {
  if (event.key === 'z' && isCtrlOrCmdPressed(event)) {
    event.preventDefault();
    undoAction();
  }
  if (isRedoKeyPadTouched(event) && isCtrlOrCmdPressed(event)) {
    event.preventDefault();
    redoAction();
  }
};

export const deleteHandlerBuilder = (deleteAction: () => void) => (event: KeyboardEvent) => {
  if (event.key === 'Backspace') {
    event.preventDefault();
    deleteAction();
  }
};

export const upAndDownHandlerBuilder = (upAction: () => void, downAction: () => void) => (
  event: KeyboardEvent,
) => {
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    upAction();
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    downAction();
  }
};

export const tabHandlerBuilder = (tabAction: () => void, unTabAction: () => void) => (
  event: KeyboardEvent,
) => {
  if (event.key === 'Tab') {
    event.preventDefault();
    event.shiftKey ? unTabAction() : tabAction();
  }
};

export const getUndoCommand = () => (isDeviceMacOs() ? '⌘ + Z' : 'Ctrl + Z');

export const getRedoCommand = () => (isDeviceMacOs() ? '⌘ + ⇧ + Z' : 'Ctrl + Y');

export const useBoolean = (initialValue = false): [boolean, () => void, () => void, () => void] => {
  const [value, setter] = useState<boolean>(initialValue);

  return [
    value,
    useCallback(() => setter(true), [setter]),
    useCallback(() => setter(false), [setter]),
    useCallback(() => setter((value) => !value), [setter]),
  ];
};
