/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type EmptyObject = Omit<Record<any, never>, keyof any>;
export type NoProps = EmptyObject;
