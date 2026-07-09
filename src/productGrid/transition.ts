import type { GridState } from "./types";
import { destinationCandidates } from "./layoutRules";
import { indexToCoord } from "./geometry";
import { relocateTextOnHover } from "./propagate";

export function onHover(
  state: GridState,
  hoverIndex: number,
  productId: number,
): GridState {
  if (hoverIndex < 0 || hoverIndex >= state.occupancy.length) return state;
  if (state.occupancy[hoverIndex] === null) return state;

  const H = hoverIndex;
  const candidates = destinationCandidates(
    indexToCoord(H, state.cols),
    state.cols,
    state.occupancy.length,
  );

  // Try each destination until one yields a valid shift chain (an unchanged
  // array means no vacancy path avoiding the hover cell exists for that D).
  let occupancy = state.occupancy;
  for (const D of candidates) {
    const next = relocateTextOnHover(state.occupancy, H, D, state.cols);
    if (next !== state.occupancy) {
      occupancy = next;
      break;
    }
  }

  return {
    ...state,
    occupancy,
    imageCellIndex: H,
    imageProductId: productId,
    hasInteracted: true,
  };
}
