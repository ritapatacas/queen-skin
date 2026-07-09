import type { Coord } from "./types";
import { coordToIndex, indexToCoord, isInBounds } from "./geometry";

export function imageDestination(
  H: Coord,
  cols: number,
  cellCount: number,
): Coord {
  if (cols === 1) {
    const below: Coord = { row: H.row + 1, col: H.col };
    if (isInBounds(below, cellCount, cols)) return below;
    const above: Coord = { row: H.row - 1, col: H.col };
    if (isInBounds(above, cellCount, cols)) return above;
    return H;
  }

  const candidates = destinationCandidates(H, cols, cellCount);
  return candidates.length > 0 ? indexToCoord(candidates[0], cols) : H;
}

/**
 * In-bounds neighbor cells where the hovered product's text can land,
 * best first. The preferred neighbor may be unusable (incomplete last row,
 * or no vacancy path that avoids the hover cell) — callers try in order.
 */
export function destinationCandidates(
  H: Coord,
  cols: number,
  cellCount: number,
): number[] {
  let destCol: number;
  if (cols === 2) destCol = H.col === 0 ? 1 : 0;
  else if (H.col === 0) destCol = 1;
  else if (H.col === 1) destCol = 2;
  else destCol = 1;

  const coords: Coord[] = [
    { row: H.row, col: destCol },
    { row: H.row, col: H.col - 1 },
    { row: H.row, col: H.col + 1 },
    { row: H.row + 1, col: H.col },
    { row: H.row - 1, col: destCol },
    { row: H.row - 1, col: H.col },
  ];
  const seen = new Set<number>();
  const result: number[] = [];
  for (const c of coords) {
    if (c.row < 0 || c.col < 0 || c.col >= cols) continue;
    if (c.row === H.row && c.col === H.col) continue;
    if (!isInBounds(c, cellCount, cols)) continue;
    const idx = coordToIndex(c, cols);
    if (seen.has(idx)) continue;
    seen.add(idx);
    result.push(idx);
  }
  return result;
}

export function imageDestinationIndex(
  hoverIndex: number,
  cols: number,
  cellCount: number,
): number {
  const H = indexToCoord(hoverIndex, cols);
  const D = imageDestination(H, cols, cellCount);
  return coordToIndex(D, cols);
}
