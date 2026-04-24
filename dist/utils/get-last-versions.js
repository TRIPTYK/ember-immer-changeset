function aggregatedLastChanges(arr) {
  const result = [];
  arr.forEach(item => {
    const existingIndex = result.findIndex(e => e.key === item.key);
    if (existingIndex !== -1) {
      result[existingIndex] = item;
    } else {
      result.push(item);
    }
  });
  return result;
}

export { aggregatedLastChanges as default };
//# sourceMappingURL=get-last-versions.js.map
