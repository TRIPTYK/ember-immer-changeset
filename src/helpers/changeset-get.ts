import { helper } from '@ember/component/helper';
import type ImmerChangeset from '../changeset/immer-changeset';

function changesetGet([changeset, key]: [ImmerChangeset | undefined, string]) {
  return changeset?.get(key);
}

export default helper(changesetGet);
