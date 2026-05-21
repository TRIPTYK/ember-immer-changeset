class ChangesetEventEmitter {
  events = {
    set: new Map()
  };
  constructor(changeset) {
    this.changeset = changeset;
  }
  emitOnSet(key, value) {
    this.events['set'].forEach(callback => callback(key, value, this.changeset));
  }
  on(event, callback) {
    const uniqueId = Symbol();
    this.events[event].set(uniqueId, callback);
    return uniqueId;
  }
  off(event, uniqueId) {
    this.events[event].delete(uniqueId);
  }
}

export { ChangesetEventEmitter as default };
//# sourceMappingURL=event-emitter.js.map
