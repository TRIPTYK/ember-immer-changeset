import type { Change } from '../types/changeset';

export default function aggregatedLastChanges(arr: Change[]) {
  const result: Change[] = [];

  arr.forEach((item) => {
    const existingIndex = result.findIndex((e) => e.key === item.key);

    if (existingIndex !== -1) {
      result[existingIndex] = item;
    } else {
      result.push(item);
    }
  });

  return result;
}
