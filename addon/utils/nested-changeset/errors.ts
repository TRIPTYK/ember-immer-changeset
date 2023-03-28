import { Changeset } from 'ember-form-changeset-validations/types/typed-changeset';
import { isChangeset } from '../is-changeset';
import { isChangesetArray } from '../is-changeset-array';

export function errors<T extends Changeset>(
  changeset: T,
  parentKey?: string
): Record<string, unknown>[] {
  const errorsMap: Record<string, unknown>[] = changeset.errors;

  for (const error of errorsMap) {
    const path = parentKey ? `${parentKey}.${error['key']}` : error['key'];
    error['key'] = path;
  }

  for (const key in changeset.data) {
    const keyValue = changeset.data[key];

    if (isChangeset(keyValue)) {
      errorsMap.push(...errors(keyValue, key));
    }
    if (isChangesetArray(keyValue)) {
      const changesetArray = keyValue as Changeset[];
      errorsMap.push(
        ...changesetArray.flatMap((changeset, i) =>
          errors(changeset, `${key}.${i}`)
        )
      );
    }
  }

  return errorsMap;
}