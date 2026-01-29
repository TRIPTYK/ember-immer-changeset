import ImmerChangeset from '../changeset/immer-changeset.ts';

export default function isChangeset(obj?: InstanceType<any>) {
  if (!obj) {
    return false;
  }

  if (obj instanceof ImmerChangeset) {
    return true;
  }

  return obj['__changeset__'] !== undefined;
}
