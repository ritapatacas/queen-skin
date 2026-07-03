/**
 * useRadialPosition Hook
 * 
 * Calculates the positions of action items in a radial menu based on
 * configurable angles and radius. This allows for flexible menu layouts
 * that can easily support different numbers of actions.
 */

import { useMemo } from 'react';
import type { RadialMenuItem, ActionPosition, RadialPositionConfig } from './types';

/**
 * Converts degrees to radians
 */
const degreesToRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/**
 * Hook to calculate radial positions for menu items
 * 
 * @param items - Array of menu items to position
 * @param config - Configuration for radial positioning
 * @returns Array of positions corresponding to each item
 */
export function useRadialPosition(
  items: RadialMenuItem[],
  config: RadialPositionConfig
): ActionPosition[] {
  const { radius, startAngle = 0, arcAngle } = config;

  return useMemo(() => {
    const itemCount = items.length;
    if (itemCount === 0) return [];

    // Determine the angle between each item
    // If arcAngle is specified, distribute items across that arc
    // Otherwise, distribute evenly across 360 degrees
    const totalArc = arcAngle ?? 360;
    const angleStep = itemCount > 1 ? totalArc / (itemCount - 1) : 0;

    // For a more natural menu layout, we offset the start angle
    // to position items in a visually pleasing arrangement
    // By default, we start from the top-right area and go clockwise
    const effectiveStartAngle = startAngle;

    return items.map((_, index) => {
      // Calculate the angle for this item
      const angleDeg = itemCount === 1
        ? effectiveStartAngle + 180 // Single item: place opposite to start
        : effectiveStartAngle + (angleStep * index);

      // Convert to radians for trigonometric calculations
      const angleRad = degreesToRadians(angleDeg);

      // Calculate x and y coordinates
      // Note: In screen coordinates, Y increases downward, so we negate sin
      const x = Math.cos(angleRad) * radius;
      const y = Math.sin(angleRad) * radius;

      return {
        x,
        y,
        angle: angleDeg,
      };
    });
  }, [items.length, radius, startAngle, arcAngle]);
}

/**
 * Utility function to calculate position for a single item
 * Useful for custom layouts or dynamic positioning
 */
export function calculateItemPosition(
  index: number,
  totalItems: number,
  config: RadialPositionConfig
): ActionPosition {
  const { radius, startAngle = 0, arcAngle } = config;

  const totalArc = arcAngle ?? 360;
  const angleStep = totalItems > 1 ? totalArc / (totalItems - 1) : 0;
  const angleDeg = totalItems === 1
    ? startAngle + 180
    : startAngle + (angleStep * index);

  const angleRad = degreesToRadians(angleDeg);
  const x = Math.cos(angleRad) * radius;
  const y = Math.sin(angleRad) * radius;

  return { x, y, angle: angleDeg };
}

/**
 * Pre-configured layout presets for common radial menu arrangements
 */
export const RadialLayoutPresets = {
  /**
   * AnyDesk-style layout: 3 items in an arc
   * Positions items in a 180-degree arc starting from top-left
   */
  anydesk: (radius: number): RadialPositionConfig => ({
    radius,
    startAngle: 225, // Start from bottom-left
    arcAngle: 270,   // Span 270 degrees clockwise
  }),

  /**
   * Top arc layout: items arranged in an arc above the button
   */
  topArc: (radius: number): RadialPositionConfig => ({
    radius,
    startAngle: 225, // Start from bottom-left
    arcAngle: 270,   // Span to bottom-right
  }),

  /**
   * Right arc layout: items arranged in an arc to the right of the button
   */
  rightArc: (radius: number): RadialPositionConfig => ({
    radius,
    startAngle: 315, // Start from bottom-right
    arcAngle: 270,   // Span to top-right
  }),

  /**
   * Full circle layout: items distributed evenly around the button
   */
  fullCircle: (radius: number): RadialPositionConfig => ({
    radius,
    startAngle: 0,
    arcAngle: undefined, // Full 360 degrees
  }),

  /**
   * Semi-circle layout: items arranged in a 180-degree arc
   */
  semiCircle: (radius: number, startAngle = 180): RadialPositionConfig => ({
    radius,
    startAngle,
    arcAngle: 180,
  }),
};