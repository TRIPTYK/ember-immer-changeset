import type { Get, Promisable } from 'type-fest';
import type { Changeset, ValidationError, ValidationFunction } from '../types/changeset.ts';
import { type OnSetCallback } from '../utils/event-emitter.ts';
/**
 * A class that represents a changeset for a given data object.
 * It uses Immer to create a draft of the data object and track changes made to it.
 * The changes can be applied, reverted, validated, and saved.
 */
export default class ImmerChangeset<T extends Record<string, any> = Record<string, any>> implements Changeset<T> {
    /**
     * The data object.
     * Read-only.
     */
    data: T;
    errorsCount: number;
    private draftData;
    private innerErrors;
    private patches;
    private inversePatches;
    private eventEmitter;
    /**
     * Returns an array of the last changes made to the data object.
     */
    get changes(): import("../index.ts").Change[];
    /**
     * Returns an array of the errors associated with the changeset.
     */
    get errors(): ValidationError[];
    /**
     * Returns a boolean indicating whether the changeset is valid (has no errors).
     */
    get isValid(): boolean;
    /**
     * Returns a boolean indicating whether the changeset is pristine (has no changes).
     */
    get isPristine(): boolean;
    /**
     * Returns a boolean indicating whether the changeset is invalid (has errors).
     */
    get isInvalid(): boolean;
    /**
     * Returns a boolean indicating whether the changeset is dirty (has changes).
     */
    get isDirty(): boolean;
    constructor(data: T);
    /**
     * Applies the accumulated changes to the `data` object.
     */
    execute(): void;
    /**
     * Reverts the previously applied changes to the `data` object.
     */
    unexecute(): void;
    /**
     * Applies the accumulated changes to the `data` object and sets the changeset in a pristine state. No rollback is possible after this.
     */
    save(): Promisable<void>;
    /**
     * Reverts the changes made to the `draft`.
     */
    rollback(): void;
    /**
     * Reverts the changes made to the specified `property` of the changeset object.
     * @param property The name of the property to revert.
     */
    rollbackProperty(property: string): void;
    /**
     * Adds a new `error` object to the changeset.
     * @param error The error object to add.
     */
    addError(error: ValidationError): void;
    /**
     * Removes the error with the specified `key` from the changeset.
     * @param key The key of the error to remove.
     */
    removeError(key: string): void;
    /**
     * Removes all errors from the changeset.
     */
    removeErrors(): void;
    /**
     * Returns the value of the specified `key` from the `draft` object.
     * @param key The name of the property to get.
     * @returns The value of the property.
     */
    get<K extends string>(key: K): Get<T, K>;
    /**
     * Sets the value of the specified `key` to the given `value` in the `draft` object.
     * @param key The name of the property to set.
     * @param value The value to set the property to.
     */
    set<K extends string>(key: K, value: Get<T, K>): void;
    /**
     * Runs the specified `validation` function on the `draft` object.
     * @param validation The validation function to run.
     */
    validate(validation: ValidationFunction<T>): Promise<void>;
    /**
     * Registers a callback function to be called whenever a property is set using the `set` method.
     * @param fn The callback function to register.
     * @returns A function that can be called to unregister the callback.
     */
    onSet(fn: OnSetCallback<this, T>): () => void;
    private normalizedPatches;
    private resetPatches;
}
//# sourceMappingURL=immer-changeset.d.ts.map