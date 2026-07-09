import { describe, expect, it } from "vitest";
import {
  assertInvariants,
  imageDestination,
  imageDestinationIndex,
  initialState,
  onHover,
  propagateVacancy,
  relocateTextOnHover,
  vacancyIndex,
} from "./gridMachine";

const IDS = [1, 2, 3, 4, 5, 6];

function hoverAt(state: ReturnType<typeof initialState>, index: number) {
  const productId = state.occupancy[index];
  if (productId === null) throw new Error("Cannot hover vacancy");
  return onHover(state, index, productId);
}

describe("initialState", () => {
  it("pads the last row with vacancies (1 to cols empties)", () => {
    const state = initialState(IDS, 3);
    expect(state.occupancy).toHaveLength(9);
    expect(state.occupancy.slice(6)).toEqual([null, null, null]);
    expect(vacancyIndex(state.occupancy)).toBe(6);
    assertInvariants(state, IDS);

    const exact = initialState([1, 2], 3);
    expect(exact.occupancy).toHaveLength(3);
    expect(exact.occupancy[2]).toBeNull();
  });
});

describe("onHover — image at hover cell, text shifts one cell at a time", () => {
  it("first hover: image at H, product text at D, one null at H", () => {
    const state = initialState(IDS, 3);
    const next = hoverAt(state, 0);
    expect(next.hasInteracted).toBe(true);
    expect(next.imageProductId).toBe(1);
    expect(next.imageCellIndex).toBe(0);
    expect(next.occupancy[0]).toBeNull();
    expect(next.occupancy[1]).toBe(1);
    expect(next.occupancy[4]).toBe(2);
    expect(next.occupancy.filter((v) => v === null).length).toBe(3);
    assertInvariants(next, IDS);
  });

  it("multiple hovers keep exactly one null", () => {
    const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    let state = initialState(ids, 3);
    state = hoverAt(state, 0);
    state = hoverAt(state, 1);
    state = hoverAt(state, 2);
    expect(state.occupancy.filter((v) => v === null).length).toBe(1);
    assertInvariants(state, ids);
  });
});

describe("relocateTextOnHover", () => {
  it("shifts chain with vacancy at hover cell", () => {
    const occupancy = [1, 2, 3, 4, 5, null];
    const next = relocateTextOnHover(occupancy, 0, 1, 3);
    expect(next[0]).toBeNull();
    expect(next[1]).toBe(1);
    expect(next[4]).toBe(2);
    expect(vacancyIndex(next)).toBe(0);
  });
});

describe("imageDestination — 3 columns", () => {
  const cellCount = 7;
  it("col 0 → col 1", () => {
    expect(imageDestination({ row: 0, col: 0 }, 3, cellCount)).toEqual({
      row: 0,
      col: 1,
    });
    expect(imageDestinationIndex(0, 3, cellCount)).toBe(1);
  });
  it("col 1 → col 2", () => {
    expect(imageDestination({ row: 1, col: 1 }, 3, cellCount)).toEqual({
      row: 1,
      col: 2,
    });
  });
  it("col 2 → col 1", () => {
    expect(imageDestination({ row: 0, col: 2 }, 3, cellCount)).toEqual({
      row: 0,
      col: 1,
    });
  });

  it("clamps to an in-bounds neighbor on an incomplete last row", () => {
    // 8 cells, 3 cols: last row has indices 6,7 — col 1 → col 2 (index 8) is out of bounds
    expect(imageDestination({ row: 2, col: 1 }, 3, 8)).toEqual({
      row: 2,
      col: 0,
    });
    // 7 cells: last row only has index 6 — col 0 → col 1 (index 7) is out of bounds
    expect(imageDestination({ row: 2, col: 0 }, 3, 7)).toEqual({
      row: 1,
      col: 1,
    });
  });

  it("hovering the last cell of an incomplete row keeps one vacancy in bounds", () => {
    const ids = [1, 2, 3, 4, 5, 6, 7];
    let state = initialState(ids, 3); // 9 cells, vacancies at 7 and 8
    state = hoverAt(state, 6);
    expect(state.occupancy).toHaveLength(9);
    assertInvariants(state, ids);
  });
});

describe("imageDestination — 1 column", () => {
  it("prefers below, clamps to above at last row", () => {
    const count = 4;
    expect(imageDestination({ row: 0, col: 0 }, 1, count)).toEqual({
      row: 1,
      col: 0,
    });
    expect(imageDestination({ row: 3, col: 0 }, 1, count)).toEqual({
      row: 2,
      col: 0,
    });
  });
});

describe("propagateVacancy", () => {
  it("is the only mutator — vertical then horizontal", () => {
    const occupancy = [1, 2, 3, 4, 5, null];
    const next = propagateVacancy(occupancy, 1, 3);
    expect(vacancyIndex(next)).toBe(1);
    expect(next.filter((v) => v !== null).sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it("no-op when start equals target", () => {
    const occupancy = [1, null, 3];
    expect(propagateVacancy(occupancy, 1, 3)).toBe(occupancy);
  });
});

describe("vacancy not hoverable", () => {
  it("onHover ignores vacancy index", () => {
    const state = initialState(IDS, 3);
    const next = onHover(state, 6, 999);
    expect(next).toEqual(state);
  });
});
