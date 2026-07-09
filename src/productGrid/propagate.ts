import { buildPath, buildAdjacentPathToNearest } from "./path";
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
  nulls: ReadonlySet<number>,
  cols: number,
  cellCount: number,
): number[] {
  const chain: number[] = [hoverIndex];
  if (hoverIndex !== destIndex) chain.push(destIndex);

  let current = chain[chain.length - 1];
  while (!nulls.has(current)) {
    const below = current + cols;
    if (below < cellCount && !chain.includes(below)) {
      chain.push(below);
      current = below;
      continue;
    }

    const path = buildAdjacentPathToNearest(current, nulls, cols, cellCount, new Set(chain));
    for (const step of path) chain.push(step);
    break;
  }

  // The bubble-down walk can dead-end away from every vacancy; fall back to
  // the minimal chain [H, D] plus a direct path to the nearest vacancy.
  if (!nulls.has(chain[chain.length - 1])) {
    const base = hoverIndex !== destIndex ? [hoverIndex, destIndex] : [hoverIndex];
    const path = buildAdjacentPathToNearest(
      base[base.length - 1],
      nulls,
      cols,
      cellCount,
      new Set(base),
    );
    return path.length > 0 ? [...base, ...path] : base;
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

  const nulls = new Set(
    occupancy.flatMap((v, i) => (v === null ? [i] : [])),
  );
  if (nulls.size === 0) return occupancy;

  const chain = buildTextShiftChain(
    hoverIndex,
    destIndex,
    nulls,
    cols,
    occupancy.length,
  );
  // An incomplete chain would overwrite a product and duplicate a vacancy.
  if (!nulls.has(chain[chain.length - 1])) return occupancy;
  return shiftAlongChain(occupancy, chain);
}
