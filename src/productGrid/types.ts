export type Coord = { row: number; col: number };

export type GridState = {
  occupancy: (number | null)[];
  imageCellIndex: number | null;
  imageProductId: number | null;
  cols: number;
  hasInteracted: boolean;
};
