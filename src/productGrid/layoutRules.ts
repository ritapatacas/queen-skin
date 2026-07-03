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

  if (cols === 2) {
    return { row: H.row, col: H.col === 0 ? 1 : 0 };
  }

  let destCol: number;
  if (H.col === 0) destCol = 1;
  else if (H.col === 1) destCol = 2;
  else destCol = 1;
  return { row: H.row, col: destCol };
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
