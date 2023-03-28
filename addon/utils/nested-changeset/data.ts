import { NestedChangesetData } from 'ember-form-changeset-validations/types/nested-changeset-data';
import { Changeset } from 'ember-form-changeset-validations/types/typed-changeset';
import { isChangeset } from '../is-changeset';
import { isChangesetArray } from '../is-changeset-array';

export function data<T extends Changeset>(
  changeset: T
): NestedChangesetData<T['data']> {
  const out: Record<string, unknown> = {};
  for (const key in changeset.data) {
    const keyValue = changeset.data[key];
    if (isChangeset(keyValue)) {
      out[key] = data(keyValue as Changeset);
    } else if (isChangesetArray(keyValue)) {
      out[key] = (keyValue as Changeset[]).map((kv) => data(kv));
    } else {
      out[key] = keyValue;
    }
  }
  return out as NestedChangesetData<T>;
}