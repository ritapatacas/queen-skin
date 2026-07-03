import { coordToIndex, indexToCoord } from "./geometry";

export function buildPath(
  start: number,
  target: number,
  cols: number,
  cellCount: number,
): number[] {
  if (start === target) return [];

  const targetCoord = indexToCoord(target, cols);
  let current = indexToCoord(start, cols);
  const steps: number[] = [];

  while (current.row !== targetCoord.row) {
    const nextRow =
      current.row < targetCoord.row ? current.row + 1 : current.row - 1;
    current = { row: nextRow, col: current.col };
    const idx = coordToIndex(current, cols);
    if (idx < 0 || idx >= cellCount) {
      throw new Error(`Path out of bounds at row ${nextRow}`);
    }
    steps.push(idx);
  }

  if (current.col !== targetCoord.col) {
    const nextCol =
      current.col < targetCoord.col ? current.col + 1 : current.col - 1;
    current = { row: current.row, col: nextCol };
    const idx = coordToIndex(current, cols);
    if (idx < 0 || idx >= cellCount) {
      throw new Error(`Path out of bounds at col ${nextCol}`);
    }
    steps.push(idx);
  }

  const finalIdx = coordToIndex(current, cols);
  if (finalIdx !== target) {
    throw new Error(`Unreachable target ${target} from ${start}`);
  }

  return steps;
}

/** Full adjacent path (BFS) for multi-step chain shifts. */
export function buildAdjacentPath(
  start: number,
  target: number,
  cols: number,
  cellCount: number,
): number[] {
  if (start === target) return [];

  const visited = new Map<number, number | null>([[start, null]]);
  const queue = [start];

  while (queue.length > 0) {
    const cur = queue.shift()!;
    const { row, col } = indexToCoord(cur, cols);
    const neighbors = [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 },
    ];

    for (const n of neighbors) {
      const idx = coordToIndex(n, cols);
      if (idx < 0 || idx >= cellCount || visited.has(idx)) continue;
      visited.set(idx, cur);
      if (idx === target) {
        const path: number[] = [];
        let p: number | null = idx;
        while (p !== null && p !== start) {
          path.unshift(p);
          p = visited.get(p) ?? null;
        }
        return path;
      }
      queue.push(idx);
    }
  }

  throw new Error(`Unreachable target ${target} from ${start}`);
}
