import { describe, it } from "vitest";
import { initialState, onHover, countNulls } from "./gridMachine";
import { destinationCandidates } from "./layoutRules";
import { indexToCoord } from "./geometry";

function check(n: number, cols: number, seed: number) {
  const ids = Array.from({ length: n }, (_, i) => i + 1);
  let state = initialState(ids, cols);
  const cellCount = Math.ceil((n + 1) / cols) * cols;
  const expectedNulls = cellCount - n;
  let rng = seed;
  const rand = () => (rng = (rng * 1103515245 + 12345) % 2 ** 31) / 2 ** 31;
  for (let step = 0; step < 200; step++) {
    const hoverables = state.occupancy.map((v, i) => (v !== null ? i : -1)).filter(i => i >= 0);
    const H = hoverables[Math.floor(rand() * hoverables.length)];
    const pid = state.occupancy[H]!;
    state = onHover(state, H, pid);
    if (state.occupancy.length !== cellCount) throw new Error(`n=${n} cols=${cols} step=${step}: len ${state.occupancy.length}, expected ${cellCount}`);
    if (countNulls(state.occupancy) !== expectedNulls) throw new Error(`n=${n} cols=${cols} step=${step}: ${countNulls(state.occupancy)} nulls, expected ${expectedNulls}`);
    if (state.imageCellIndex !== H) throw new Error("image not at H");
    if (state.occupancy[H] !== null) throw new Error(`n=${n} cols=${cols} step=${step}: hover cell not vacated, occ=${state.occupancy}`);
    // the hovered product's name must land on an adjacent candidate cell
    const cands = destinationCandidates(indexToCoord(H, cols), cols, cellCount);
    const D = cands.find(c => state.occupancy[c] === pid);
    if (D === undefined) throw new Error(`n=${n} cols=${cols} step=${step}: name not adjacent. H=${H} occ=${state.occupancy}`);
    // with padded rows every row is complete, so the name must be side by side
    if (cols >= 2 && Math.floor(D / cols) !== Math.floor(H / cols)) {
      throw new Error(`n=${n} cols=${cols} step=${step}: name on different row. H=${H} D=${D} occ=${state.occupancy}`);
    }
    // no product lost or duplicated
    const present = state.occupancy.filter((v): v is number => v !== null).sort((a, b) => a - b);
    if (present.length !== n || present.some((v, i) => v !== i + 1)) {
      throw new Error(`n=${n} cols=${cols} step=${step}: products corrupted, occ=${state.occupancy}`);
    }
  }
}

describe("simulation", () => {
  it("random hovers keep image+name side by side on complete rows", () => {
    for (const cols of [1, 2, 3]) for (let n = 4; n <= 20; n++) for (const seed of [1, 7, 42]) check(n, cols, seed);
  });
});
