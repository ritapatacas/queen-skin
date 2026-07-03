import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import {
  inferColsFromRects,
  initialState,
  onHover,
  type GridState,
} from "./gridMachine";

type HoverAction = {
  type: "HOVER";
  hoverIndex: number;
  productId: number;
  cols: number;
};

type ResetAction = {
  type: "RESET";
  productIds: number[];
  cols: number;
};

type GridAction = HoverAction | ResetAction;

function gridReducer(state: GridState, action: GridAction): GridState {
  switch (action.type) {
    case "HOVER":
      return onHover(
        { ...state, cols: action.cols },
        action.hoverIndex,
        action.productId,
      );
    case "RESET":
      return initialState(action.productIds, action.cols);
    default:
      return state;
  }
}

function occupancyEqual(
  a: (number | null)[],
  b: (number | null)[],
): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

function statesEqual(a: GridState, b: GridState): boolean {
  return (
    a.hasInteracted === b.hasInteracted &&
    a.imageProductId === b.imageProductId &&
    a.imageCellIndex === b.imageCellIndex &&
    occupancyEqual(a.occupancy, b.occupancy)
  );
}

export function useProductGrid(
  productIds: number[],
  gridRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
) {
  const cardRectsRef = useRef<
    { left: number; right: number; top: number; bottom: number }[]
  >([]);
  const colsRef = useRef(1);
  const productIdsKey = productIds.join(",");

  const [state, dispatch] = useReducer(
    gridReducer,
    { productIdsKey, cols: 1 },
    ({ productIdsKey, cols }) =>
      initialState(
        productIdsKey ? productIdsKey.split(",").map(Number) : [],
        cols,
      ),
  );

  const captureRects = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;
    cardRectsRef.current = [...grid.children].map((el) => {
      const r = el.getBoundingClientRect();
      return {
        left: r.left + window.scrollX,
        right: r.right + window.scrollX,
        top: r.top + window.scrollY,
        bottom: r.bottom + window.scrollY,
      };
    });
    const cols = inferColsFromRects(cardRectsRef.current);
    if (cols !== colsRef.current) {
      colsRef.current = cols;
      dispatch({
        type: "RESET",
        productIds: productIdsKey.split(",").map(Number),
        cols,
      });
    }
  }, [gridRef, productIdsKey]);

  useEffect(() => {
    dispatch({
      type: "RESET",
      productIds: productIdsKey.split(",").map(Number),
      cols: colsRef.current,
    });
  }, [productIdsKey]);

  useLayoutEffect(() => {
    if (!enabled) return;
    captureRects();
  }, [enabled, captureRects, state.occupancy, state.cols]);

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener("resize", captureRects);
    return () => window.removeEventListener("resize", captureRects);
  }, [enabled, captureRects]);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rects = cardRectsRef.current;
      const idx = rects.findIndex(
        (r) =>
          e.pageX >= r.left &&
          e.pageX <= r.right &&
          e.pageY >= r.top &&
          e.pageY <= r.bottom,
      );
      if (idx === -1) {
        setHoveredIndex(null);
        return;
      }
      if (state.occupancy[idx] === null) {
        setHoveredIndex(null);
        return;
      }

      setHoveredIndex(idx);
      const productId = state.occupancy[idx];
      if (productId === null) return;

      const cols = colsRef.current;
      const effectiveState =
        state.cols === cols ? state : { ...state, cols };

      const preview = onHover(effectiveState, idx, productId);
      if (statesEqual(preview, effectiveState)) return;

      dispatch({ type: "HOVER", hoverIndex: idx, productId, cols });
    },
    [state],
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  return { state, hoveredIndex, handleMouseMove, handleMouseLeave, captureRects };
}
