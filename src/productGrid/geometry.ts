import type { Coord, GridState } from "./types";

export function rowCount(cellCount: number, cols: number): number {
  return Math.ceil(cellCount / cols);
}

export function indexToCoord(index: number, cols: number): Coord {
  return { row: Math.floor(index / cols), col: index % cols };
}

export function coordToIndex(coord: Coord, cols: number): number {
  return coord.row * cols + coord.col;
}

export function isInBounds(coord: Coord, cellCount: number, cols: number): boolean {
  const idx = coordToIndex(coord, cols);
  return idx >= 0 && idx < cellCount;
}

export function vacancyIndex(occupancy: (number | null)[]): number {
  const idx = occupancy.indexOf(null);
  if (idx === -1) throw new Error("No vacancy in occupancy");
  return idx;
}

export function vacancyCoord(state: GridState): Coord {
  return indexToCoord(vacancyIndex(state.occupancy), state.cols);
}

export function inferColsFromRects(rects: { left: number }[]): number {
  if (rects.length === 0) return 1;
  const tolerance = 1;
  const lefts = [...rects.map((r) => r.left)].sort((a, b) => a - b);
  const uniqueLefts: number[] = [];
  for (const left of lefts) {
    if (
      uniqueLefts.length === 0 ||
      Math.abs(left - uniqueLefts[uniqueLefts.length - 1]) > tolerance
    ) {
      uniqueLefts.push(left);
    }
  }
  return Math.max(1, uniqueLefts.length);
}

export function coordsEqual(a: Coord, b: Coord): boolean {
  return a.row === b.row && a.col === b.col;
}
