import type { Get, Promisable, KeyAsString } from 'type-fest';
import {
  produce,
  type Draft,
  type Patch,
  applyPatches,
  enablePatches,
} from 'immer';
import { action, get, set } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import type {
  Changeset,
  ValidationError,
  ValidationFunction,
} from '../types/changeset.ts';
import aggregatedLastChanges from '../utils/get-last-versions.ts';
import {
  default as ChangesetEventEmitter,
  type OnSetCallback,
} from '../utils/event-emitter.ts';

enablePatches();

/**
 * A class that represents a changeset for a given data object.
 * It uses Immer to create a draft of the data object and track changes made to it.
 * The changes can be applied, reverted, validated, and saved.
 */
export default class ImmerChangeset<
  T extends Record<string, any> = Record<string, any>,
> implements Changeset<T>
{
  /**
   * The data object.
   * Read-only.
   */
  @tracked
  data: T;

  @tracked errorsCount = 1;

  @tracked
  private draftData: T;

  @tracked
  private innerErrors: Record<string, ValidationError> = {};

  private patches: Patch[] = [];
  private inversePatches: Patch[] = [];
  private eventEmitter = new ChangesetEventEmitter<this, T>(this);

  /**
   * Returns an array of the last changes made to the data object.
   */
  get changes() {
    return aggregatedLastChanges(this.normalizedPatches());
  }

  /**
   * Returns an array of the errors associated with the changeset.
   */
  get errors() {
    return Object.values(this.innerErrors);
  }

  /**
   * Returns a boolean indicating whether the changeset is valid (has no errors).
   */
  get isValid() {
    return this.errors.length === 0;
  }

  /**
   * Returns a boolean indicating whether the changeset is pristine (has no changes).
   */
  get isPristine() {
    return this.patches.length + this.inversePatches.length === 0;
  }

  /**
   * Returns a boolean indicating whether the changeset is invalid (has errors).
   */
  get isInvalid() {
    return !this.isValid;
  }

  /**
   * Returns a boolean indicating whether the changeset is dirty (has changes).
   */
  get isDirty() {
    return !this.isPristine;
  }

  public constructor(data: T) {
    this.data = produce(data, () => {});
    this.draftData = produce(data, () => {});
  }

  /**
   * Applies the accumulated changes to the `data` object.
   */
  execute(): void {
    this.data = applyPatches(this.data, this.patches);
  }

  /**
   * Reverts the previously applied changes to the `data` object.
   */
  unexecute(): void {
    this.data = applyPatches(this.data, this.inversePatches);
  }

  /**
   * Applies the accumulated changes to the `data` object and sets the changeset in a pristine state. No rollback is possible after this.
   */
  save(): Promisable<void> {
    if (!this.isValid) {
      throw new Error('Cannot save an invalid changeset.');
    }

    this.data = applyPatches(this.data, this.patches);
    this.resetPatches();
  }

  /**
   * Reverts the changes made to the `draft`.
   */
  rollback(): void {
    this.draftData = applyPatches(this.draftData, this.inversePatches);
  }

  /**
   * Reverts the changes made to the specified `property` of the changeset object.
   * @param property The name of the property to revert.
   */
  rollbackProperty(property: string): void {
    this.set(property, get(this.data, property) as never);
  }

  /**
   * Adds a new `error` object to the changeset.
   * @param error The error object to add.
   */
  @action
  addError(error: ValidationError) {
    this.errorsCount = this.errorsCount + 1;
    this.innerErrors = { ...this.innerErrors, [error.key]: error };
  };

  /**
   * Removes the error with the specified `key` from the changeset.
   * @param key The key of the error to remove.
   */
  removeError(key: string): void {
    delete this.innerErrors[key];
    this.innerErrors = { ...this.innerErrors };
  }

  /**
   * Removes all errors from the changeset.
   */
  removeErrors(): void {
    this.innerErrors = {};
  }

  /**
   * Returns the value of the specified `key` from the `draft` object.
   * @param key The name of the property to get.
   * @returns The value of the property.
   */
  get<K extends string>(key: K): Get<T, K> {
    return get(this.draftData, key) as Get<T, K>;
  }

  /**
   * Sets the value of the specified `key` to the given `value` in the `draft` object.
   * @param key The name of the property to set.
   * @param value The value to set the property to.
   */
  set<K extends string>(key: K, value: Get<T, K>): void {
    this.draftData = produce(
      this.draftData,
      (d: Draft<T>) => {
        set(d, key as KeyAsString<Draft<T>>, value as never);
      },
      (patches, inversePatches) => {
        this.patches.push(...patches);
        this.inversePatches.push(...inversePatches);
      },
    );
    this.eventEmitter.emitOnSet(key as KeyAsString<T>, value as never);
  }

  /**
   * Runs the specified `validation` function on the `draft` object.
   * @param validation The validation function to run.
   */
  async validate(validation: ValidationFunction<T>) {
    await validation(this.draftData);
  }

  /**
   * Registers a callback function to be called whenever a property is set using the `set` method.
   * @param fn The callback function to register.
   * @returns A function that can be called to unregister the callback.
   */
  public onSet(fn: OnSetCallback<this, T>) {
    const listener = this.eventEmitter.on('set', fn);
    return () => {
      this.eventEmitter.off('set', listener);
    };
  }

  private normalizedPatches() {
    return this.patches.map((patch) => ({
      value: patch.value,
      key: patch.path.join('.'),
    }));
  }

  private resetPatches() {
    this.patches = [];
    this.inversePatches = [];
  }
}
