import type { Promisable } from 'type-fest';

export type ValidationError = {
  message?: string;
  params?: Record<string, unknown>;
  key: string;
  value: unknown;
  originalValue: unknown;
};

export type ValidationFunction<T extends Record<string, unknown>> = (
  data: T,
) => Promisable<void>;

export interface Change {
  key: string;
  value: unknown;
}

/**
 * This interface is for the old changeset compatibility
 */
export interface Changeset<
  T extends Record<string, any> = Record<string, any>,
> {
  data: T;
  changes: Change[];
  errors: ValidationError[];
  isValid: boolean;
  isPristine: boolean;
  isInvalid: boolean;
  isDirty: boolean;
  execute(): void;
  unexecute(): void;
  save(options?: Record<string, unknown>): Promisable<void>;
  rollback(): void;
  rollbackProperty(key: string): void;
  addError(error: ValidationError): void;
  get(key: string): unknown;
  set(key: string, value: unknown): void;
  validate(fn: ValidationFunction<T>): Promisable<void>;
}
