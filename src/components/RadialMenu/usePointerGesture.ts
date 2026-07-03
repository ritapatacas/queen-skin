/**
 * usePointerGesture Hook
 * 
 * Handles pointer events (mouse and touch) for the radial menu,
 * implementing the AnyDesk-style press-and-slide interaction pattern.
 * 
 * Key behaviors:
 * - Press menu button to open
 * - Drag to hover over actions (with hit detection)
 * - Release over action to activate
 * - Release outside to close (with optional delay)
 */

import { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import type { RadialMenuItem, ActionPosition, PointerInteractionState } from './types';

/**
 * Configuration for the pointer gesture hook
 */
export interface UsePointerGestureConfig {
  /** Delay before auto-closing when releasing outside an action (ms) */
  closeDelay: number;
  /** Hit radius for detecting which action is being touched (px) */
  hitRadius: number;
  /** Callback when the menu should close */
  onClose: () => void;
  /** Callback when an action is activated */
  onActivate: (item: RadialMenuItem) => void;
}

/**
 * Return type for the pointer gesture hook
 */
export interface UsePointerGestureReturn {
  /** Current interaction state */
  state: PointerInteractionState;
  /** Handler for pointer down events on the menu button */
  handlePointerDown: (e: React.PointerEvent) => void;
  /** Handler for pointer move events (attach to a container covering the menu area) */
  handlePointerMove: (e: React.PointerEvent) => void;
  /** Handler for pointer up events (attach to a container covering the menu area) */
  handlePointerUp: (e: React.PointerEvent) => void;
  /** Handler for click events on action items (for tap support) */
  handleActionClick: (item: RadialMenuItem) => void;
  /** Handler for pointer enter events on action items */
  handleActionPointerEnter: (itemId: string) => void;
  /** Handler for pointer leave events on action items */
  handleActionPointerLeave: () => void;
  /** Ref to the menu container for position calculations */
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Hook for handling pointer gestures on the radial menu
 */
export function usePointerGesture(
  items: RadialMenuItem[],
  positions: ActionPosition[],
  config: UsePointerGestureConfig
): UsePointerGestureReturn {
  const { closeDelay, hitRadius, onClose, onActivate } = config;

  const containerRef = useRef<HTMLDivElement>(null);

  // Interaction state
  const [state, setState] = useState<PointerInteractionState>({
    isPressed: false,
    isOpen: false,
    activeActionId: null,
    pointerPosition: null,
  });

  // Refs to track state during event handlers (avoid stale closures)
  const stateRef = useRef(state);
  stateRef.current = state;

  // Ref for auto-close timeout
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear any pending close timeout
  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  /**
   * Detect which action (if any) is closest to the pointer position
   * Uses hit radius for easier touch selection
   */
  const detectActiveAction = useCallback((clientX: number, clientY: number): string | null => {
    if (!containerRef.current || items.length === 0) return null;

    const rect = containerRef.current.getBoundingClientRect();
    // Center of the menu (where the main button is)
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Pointer position relative to menu center
    const relX = clientX - centerX;
    const relY = clientY - centerY;

    let closestActionId: string | null = null;
    let closestDistance = Infinity;

    items.forEach((item, index) => {
      const pos = positions[index];
      if (!pos) return;

      // Calculate distance from pointer to action center
      const distance = Math.sqrt(
        Math.pow(relX - pos.x, 2) + Math.pow(relY - pos.y, 2)
      );

      // Check if pointer is within the hit radius of this action
      // The hit radius is larger than the visual action size for easier selection
      if (distance <= hitRadius) {
        if (distance < closestDistance) {
          closestDistance = distance;
          closestActionId = item.id;
        }
      }
    });

    return closestActionId;
  }, [items, positions, hitRadius]);

  /**
   * Handle pointer down on the menu button
   * Opens the menu and starts tracking
   */
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Capture the pointer to ensure we receive all subsequent events
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    clearCloseTimeout();

    setState({
      isPressed: true,
      isOpen: true,
      activeActionId: null,
      pointerPosition: null,
    });
  }, [clearCloseTimeout]);

  /**
   * Handle pointer move anywhere in the menu area
   * Detects which action is being hovered
   */
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!stateRef.current.isOpen) return;

    const activeActionId = detectActiveAction(e.clientX, e.clientY);

    setState(prev => ({
      ...prev,
      activeActionId,
      pointerPosition: { x: e.clientX, y: e.clientY },
    }));
  }, [detectActiveAction]);

  /**
   * Handle pointer up anywhere in the menu area
   * Activates the hovered action or schedules auto-close
   */
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    e.preventDefault();

    const currentState = stateRef.current;
    
    // Release pointer capture
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Pointer capture may already be released
    }

    if (currentState.activeActionId) {
      // Find and activate the selected action
      const action = items.find(item => item.id === currentState.activeActionId);
      if (action) {
        onActivate(action);
        setState({
          isPressed: false,
          isOpen: false,
          activeActionId: null,
          pointerPosition: null,
        });
        onClose();
        return;
      }
    }

    // Released outside any action - schedule delayed close
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setState({
        isPressed: false,
        isOpen: false,
        activeActionId: null,
        pointerPosition: null,
      });
      onClose();
    }, closeDelay);
  }, [items, onActivate, onClose, closeDelay, clearCloseTimeout]);

  /**
   * Handle click on an action item (for tap support)
   */
  const handleActionClick = useCallback((item: RadialMenuItem) => {
    if (!stateRef.current.isOpen) return;
    
    clearCloseTimeout();
    onActivate(item);
    setState({
      isPressed: false,
      isOpen: false,
      activeActionId: null,
      pointerPosition: null,
    });
    onClose();
  }, [onActivate, onClose, clearCloseTimeout]);

  /**
   * Handle pointer enter on an action item
   */
  const handleActionPointerEnter = useCallback((itemId: string) => {
    if (!stateRef.current.isOpen) return;
    
    setState(prev => ({
      ...prev,
      activeActionId: itemId,
    }));
  }, []);

  /**
   * Handle pointer leave on an action item
   */
  const handleActionPointerLeave = useCallback(() => {
    setState(prev => ({
      ...prev,
      activeActionId: null,
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearCloseTimeout();
  }, [clearCloseTimeout]);

  return useMemo(() => ({
    state,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleActionClick,
    handleActionPointerEnter,
    handleActionPointerLeave,
    containerRef,
  }), [
    state,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleActionClick,
    handleActionPointerEnter,
    handleActionPointerLeave,
  ]);
}