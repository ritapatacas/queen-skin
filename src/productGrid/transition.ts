import type { GridState } from "./types";
import { imageDestinationIndex } from "./layoutRules";
import { relocateTextOnHover } from "./propagate";

export function onHover(
  state: GridState,
  hoverIndex: number,
  productId: number,
): GridState {
  if (hoverIndex < 0 || hoverIndex >= state.occupancy.length) return state;
  if (state.occupancy[hoverIndex] === null) return state;

  const H = hoverIndex;
  const D = imageDestinationIndex(H, state.cols, state.occupancy.length);

  let occupancy = state.occupancy;
  if (H !== D) {
    occupancy = relocateTextOnHover(occupancy, H, D, state.cols);
  }

  return {
    ...state,
    occupancy,
    imageCellIndex: H,
    imageProductId: productId,
    hasInteracted: true,
  };
}
