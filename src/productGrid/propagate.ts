import { buildPath, buildAdjacentPath } from "./path";
import { vacancyIndex } from "./geometry";

export function propagateVacancy(
  occupancy: (number | null)[],
  target: number,
  cols: number,
): (number | null)[] {
  const start = vacancyIndex(occupancy);
  if (start === target) return occupancy;

  const path = buildPath(start, target, cols, occupancy.length);
  const next = [...occupancy];
  let nullPos = start;

  for (const stepIdx of path) {
    next[nullPos] = next[stepIdx];
    next[stepIdx] = null;
    nullPos = stepIdx;
  }

  return next;
}

export function buildTextShiftChain(
  hoverIndex: number,
  destIndex: number,
  nullIdx: number,
  cols: number,
  cellCount: number,
): number[] {
  const chain: number[] = [hoverIndex];
  if (hoverIndex !== destIndex) chain.push(destIndex);

  let current = chain[chain.length - 1];
  while (current !== nullIdx) {
    const below = current + cols;
    if (below < cellCount) {
      if (below === nullIdx) {
        chain.push(below);
        break;
      }
      if (!chain.includes(below)) {
        chain.push(below);
        current = below;
        continue;
      }
    }

    const path = buildAdjacentPath(current, nullIdx, cols, cellCount);
    if (path.length === 0) break;
    for (const step of path) {
      if (chain[chain.length - 1] === step) continue;
      chain.push(step);
      if (step === nullIdx) break;
    }
    break;
  }

  return chain;
}

export function shiftAlongChain(
  occupancy: (number | null)[],
  chain: number[],
): (number | null)[] {
  if (chain.length < 2) return occupancy;

  const occ = [...occupancy];
  for (let i = chain.length - 1; i > 0; i--) {
    occ[chain[i]] = occ[chain[i - 1]];
  }
  occ[chain[0]] = null;
  return occ;
}

/** Move hovered product text one step per cell along chain; vacancy lands on hover cell. */
export function relocateTextOnHover(
  occupancy: (number | null)[],
  hoverIndex: number,
  destIndex: number,
  cols: number,
): (number | null)[] {
  if (hoverIndex === destIndex) return occupancy;
  if (occupancy[hoverIndex] === null) return occupancy;

  const nullIdx = vacancyIndex(occupancy);
  const chain = buildTextShiftChain(
    hoverIndex,
    destIndex,
    nullIdx,
    cols,
    occupancy.length,
  );
  return shiftAlongChain(occupancy, chain);
}
