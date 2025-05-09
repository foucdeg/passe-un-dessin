import React, { useCallback, useEffect, useRef, useState } from 'react';

export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type EmptyObject = Omit<Record<any, never>, keyof any>;
export type NoProps = EmptyObject;

const emailRegexp =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

export const isValidEmail = (input: string) => !!input.match(emailRegexp);

const MAC_OS_PLATFORMS = ['macOS', 'Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];

export const isDeviceMacOs = () =>
  MAC_OS_PLATFORMS.includes(window.navigator.userAgentData?.platform || window.navigator.platform);

const isCtrlOrCmdPressed = (event: KeyboardEvent) => {
  if (isDeviceMacOs()) {
    return event.metaKey;
  }
  return event.ctrlKey;
};

const isZPressed = (event: KeyboardEvent) => {
  return event.key.toLowerCase() === 'z';
};

const isYPressed = (event: KeyboardEvent) => {
  return event.key.toLowerCase() === 'y';
};

const isRedoKeyPadTouched = (event: KeyboardEvent) => {
  if (isDeviceMacOs()) {
    return isZPressed(event) && event.shiftKey;
  }
  return isYPressed(event);
};

export const undoAndRedoHandlerBuilder =
  (undoAction: () => void, redoAction: () => void) => (event: KeyboardEvent) => {
    if (isZPressed(event) && isCtrlOrCmdPressed(event) && !event.shiftKey) {
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

export const enterHandlerBuilder = (enterAction: () => void) => (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    enterAction();
  }
};

export const upAndDownHandlerBuilder =
  (upAction: () => void, downAction: () => void) => (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      upAction();
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      downAction();
    }
  };

export const tabHandlerBuilder =
  (tabAction: () => void, unTabAction: () => void) => (event: KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      if (event.shiftKey) {
        unTabAction();
      } else {
        tabAction();
      }
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

export const enumerate = (items: string[], conjunction: string): string => {
  if (!items.length) return '';
  if (items.length === 1) return items[0];

  const last = items.pop();
  return `${items.join(', ')} ${conjunction} ${last}`;
};

export function useDebouncedState<T>(
  initialValue: T,
  timeout = 200,
): [T, T, React.Dispatch<React.SetStateAction<T>>] {
  const [liveValue, setLiveValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  const timer = useRef<NodeJS.Timeout>(undefined);

  const debouncedSetValue = useCallback(
    (val: T) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => setDebouncedValue(val), timeout);
    },
    [timeout, setDebouncedValue],
  );

  useEffect(() => {
    debouncedSetValue(liveValue);
  }, [liveValue, debouncedSetValue]);

  return [liveValue, debouncedValue, setLiveValue];
}

export function useChangeNotifier<T>(varName: string, value: T) {
  const ref = useRef<T>(value);

  useEffect(() => {
    console.log('%s changed: old = %O, new = %O', varName, ref.current, value);
    ref.current = value;
  }, [varName, value]);
}
