import { enablePatches, produce, applyPatches } from 'immer';
import { get, action, set } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import aggregatedLastChanges from '../utils/get-last-versions.js';
import ChangesetEventEmitter from '../utils/event-emitter.js';
import { g, i, n } from 'decorator-transforms/runtime-esm';

enablePatches();

/**
 * A class that represents a changeset for a given data object.
 * It uses Immer to create a draft of the data object and track changes made to it.
 * The changes can be applied, reverted, validated, and saved.
 */
class ImmerChangeset {
  static {
    g(this.prototype, "data", [tracked]);
  }
  #data = (i(this, "data"), void 0);
  /**
   * The data object.
   * Read-only.
   */
  static {
    g(this.prototype, "errorsCount", [tracked], function () {
      return 1;
    });
  }
  #errorsCount = (i(this, "errorsCount"), void 0);
  static {
    g(this.prototype, "draftData", [tracked]);
  }
  #draftData = (i(this, "draftData"), void 0);
  static {
    g(this.prototype, "innerErrors", [tracked], function () {
      return {};
    });
  }
  #innerErrors = (i(this, "innerErrors"), void 0);
  patches = [];
  inversePatches = [];
  eventEmitter = new ChangesetEventEmitter(this);

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
  constructor(data) {
    this.data = produce(data, () => {});
    this.draftData = produce(data, () => {});
  }

  /**
   * Applies the accumulated changes to the `data` object.
   */
  execute() {
    this.data = applyPatches(this.data, this.patches);
  }

  /**
   * Reverts the previously applied changes to the `data` object.
   */
  unexecute() {
    this.data = applyPatches(this.data, this.inversePatches);
  }

  /**
   * Applies the accumulated changes to the `data` object and sets the changeset in a pristine state. No rollback is possible after this.
   */
  save() {
    if (!this.isValid) {
      throw new Error('Cannot save an invalid changeset.');
    }
    this.data = applyPatches(this.data, this.patches);
    this.resetPatches();
  }

  /**
   * Reverts the changes made to the `draft`.
   */
  rollback() {
    this.draftData = applyPatches(this.draftData, this.inversePatches);
  }

  /**
   * Reverts the changes made to the specified `property` of the changeset object.
   * @param property The name of the property to revert.
   */
  rollbackProperty(property) {
    this.set(property, get(this.data, property));
  }

  /**
   * Adds a new `error` object to the changeset.
   * @param error The error object to add.
   */
  addError(error) {
    this.errorsCount = this.errorsCount + 1;
    this.innerErrors = {
      ...this.innerErrors,
      [error.key]: error
    };
  }
  static {
    n(this.prototype, "addError", [action]);
  }
  /**
   * Removes the error with the specified `key` from the changeset.
   * @param key The key of the error to remove.
   */
  removeError(key) {
    delete this.innerErrors[key];
    this.innerErrors = {
      ...this.innerErrors
    };
  }

  /**
   * Removes all errors from the changeset.
   */
  removeErrors() {
    this.innerErrors = {};
  }

  /**
   * Returns the value of the specified `key` from the `draft` object.
   * @param key The name of the property to get.
   * @returns The value of the property.
   */
  get(key) {
    return get(this.draftData, key);
  }

  /**
   * Sets the value of the specified `key` to the given `value` in the `draft` object.
   * @param key The name of the property to set.
   * @param value The value to set the property to.
   */
  set(key, value) {
    this.draftData = produce(this.draftData, d => {
      set(d, key, value);
    }, (patches, inversePatches) => {
      this.patches.push(...patches);
      this.inversePatches.push(...inversePatches);
    });
    this.eventEmitter.emitOnSet(key, value);
  }

  /**
   * Runs the specified `validation` function on the `draft` object.
   * @param validation The validation function to run.
   */
  async validate(validation) {
    await validation(this.draftData);
  }

  /**
   * Registers a callback function to be called whenever a property is set using the `set` method.
   * @param fn The callback function to register.
   * @returns A function that can be called to unregister the callback.
   */
  onSet(fn) {
    const listener = this.eventEmitter.on('set', fn);
    return () => {
      this.eventEmitter.off('set', listener);
    };
  }
  normalizedPatches() {
    return this.patches.map(patch => ({
      value: patch.value,
      key: patch.path.join('.')
    }));
  }
  resetPatches() {
    this.patches = [];
    this.inversePatches = [];
  }
}

export { ImmerChangeset as default };
//# sourceMappingURL=immer-changeset.js.map
