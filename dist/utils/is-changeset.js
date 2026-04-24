import ImmerChangeset from '../changeset/immer-changeset.js';

function isChangeset(obj) {
  if (!obj) {
    return false;
  }
  if (obj instanceof ImmerChangeset) {
    return true;
  }
  return obj['__changeset__'] !== undefined;
}

export { isChangeset as default };
//# sourceMappingURL=is-changeset.js.map
