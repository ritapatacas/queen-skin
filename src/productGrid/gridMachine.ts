export type { Coord, GridState } from "./types";
export {
  coordToIndex,
  coordsEqual,
  indexToCoord,
  inferColsFromRects,
  rowCount,
  vacancyCoord,
  vacancyIndex,
} from "./geometry";
export { imageDestination, imageDestinationIndex } from "./layoutRules";
export { buildAdjacentPath, buildPath } from "./path";
export { propagateVacancy, relocateTextOnHover, buildTextShiftChain, shiftAlongChain } from "./propagate";
export { onHover } from "./transition";

import type { GridState } from "./types";

export function initialState(productIds: number[], cols: number): GridState {
  // Pad with vacancies so the last row is always complete: at least one
  // vacancy, at most `cols` (products + 1..cols empty cells).
  const safeCols = Math.max(1, cols);
  const cellCount = Math.ceil((productIds.length + 1) / safeCols) * safeCols;
  return {
    occupancy: [
      ...productIds,
      ...Array<null>(cellCount - productIds.length).fill(null),
    ],
    imageCellIndex: null,
    imageProductId: null,
    cols,
    hasInteracted: false,
  };
}

export function countNulls(occupancy: (number | null)[]): number {
  return occupancy.filter((v) => v === null).length;
}

export function assertInvariants(state: GridState, productIds: number[]): void {
  const expectedNulls = state.occupancy.length - productIds.length;
  if (expectedNulls < 1 || countNulls(state.occupancy) !== expectedNulls) {
    throw new Error(`Expected ${expectedNulls} nulls, got ${countNulls(state.occupancy)}`);
  }
  const expected = new Set(productIds);
  const present = state.occupancy.filter((v): v is number => v !== null);
  if (present.length !== productIds.length) {
    throw new Error("Product count mismatch");
  }
  for (const id of present) {
    if (!expected.has(id)) throw new Error(`Unexpected product id ${id}`);
  }
}
