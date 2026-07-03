/**
 * RadialMenu Component
 * 
 * Layout: 2x2 grid
 *   [Action 0] [Menu Button]
 *   [Action 1] [Action 2]
 */

import React, { useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RadialMenuProps, RadialMenuItem } from './types';

const DEFAULT_CONFIG = {
  animationDuration: 400,
  closeDelay: 300,
  springStiffness: 300,
  springDamping: 20,
  hoverScale: 1.2,
  buttonBgColor: 'rgba(57, 60, 162, 0.9)',
  actionBgColor: 'rgba(255, 255, 255, 0.15)',
  buttonIconColor: '#ffffff',
  actionIconColor: '#ffffff',
  hoverGlowColor: 'rgba(255, 255, 255, 0.3)',
  buttonSize: 56,
  actionSize: 38,
  iconSize: 18,
  gap: 8,
  zIndex: 1000,
} as const;

const springTransition = {
  type: 'spring' as const,
  stiffness: DEFAULT_CONFIG.springStiffness,
  damping: DEFAULT_CONFIG.springDamping,
};

const B = DEFAULT_CONFIG.buttonSize;  // 56
const A = DEFAULT_CONFIG.actionSize;   // 38
const G = DEFAULT_CONFIG.gap;          // 8

// Container size to fit all items: 2 columns × (actionSize + gap) + buttonSize offset
const CONTAINER_W = B + A + G;  // 56 + 38 + 8 = 102
const CONTAINER_H = B + A + G;  // same

// Grid cell positions (relative to container's top-left)
// Menu button at top-right: (B/2, B/2) from top-right
// Actions positioned by their center relative to button center:
//   Action 0 (col=0, row=0): button center + (-(A+G), 0) = (-46, 0) from button center
//   Action 1 (col=0, row=1): button center + (-(A+G), A+G) = (-46, 46)
//   Action 2 (col=1, row=1): button center + (0, A+G) = (0, 46)
// Button center is at (CONTAINER_W - B/2, B/2) = (74, 28) from container's top-left

// Let's place the button at (CONTAINER_W - B, 0) from container's top-left = (46, 0)
// Button center = (46 + 28, 0 + 28) = (74, 28) from container's top-left
// Action center relative to container:

const BTN_X = CONTAINER_W - B; // right-aligned at 46
const BTN_Y = 0;
const CX = BTN_X + B / 2; // center X = 74
const CY = BTN_Y + B / 2; // center Y = 28

interface GridPos {
  col: number;
  row: number;
}

const GRID_POS: GridPos[] = [
  { col: 0, row: 0 },
  { col: 0, row: 1 },
  { col: 1, row: 1 },
];

function getActionCenter(index: number): { x: number; y: number } {
  const g = GRID_POS[index];
  return {
    x: CX + (g.col - 1) * (A + G),
    y: CY + g.row * (A + G),
  };
}

interface MainButtonProps {
  isOpen: boolean;
  isPressed: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
}

const MainButton: React.FC<MainButtonProps> = ({ isOpen, isPressed, onPointerDown }) => {
  return (
    <motion.button
      onPointerDown={onPointerDown}
      className="radial-menu-button"
      style={{
        position: 'absolute',
        left: BTN_X,
        top: BTN_Y,
        width: B,
        height: B,
        borderRadius: '50%',
        border: 'none',
        backgroundColor: DEFAULT_CONFIG.buttonBgColor,
        color: DEFAULT_CONFIG.buttonIconColor,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isOpen
          ? '0 4px 20px rgba(0, 0, 0, 0.3)'
          : '0 2px 10px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 1001,
        touchAction: 'none',
        outline: 'none',
      }}
      initial={false}
      animate={{
        scale: isPressed ? 0.9 : 1,
        rotate: isOpen ? 90 : 0,
      }}
      transition={springTransition}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Open menu"
      aria-expanded={isOpen}
    >
      <i className="fa-solid fa-ellipsis" style={{ fontSize: DEFAULT_CONFIG.iconSize * 1.2 }} />
    </motion.button>
  );
};

interface ActionItemProps {
  item: RadialMenuItem;
  isActive: boolean;
  isOpen: boolean;
  index: number;
  onClick: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

const ActionItem: React.FC<ActionItemProps> = ({
  item, isActive, isOpen, index, onClick, onPointerEnter, onPointerLeave,
}) => {
  const delay = index * 0.05;
  const center = getActionCenter(index);

  return (
    <motion.div
      className="radial-menu-action"
      style={{
        position: 'absolute',
        left: center.x - A / 2,
        top: center.y - A / 2,
        width: A,
        height: A,
        borderRadius: '50%',
        backgroundColor: DEFAULT_CONFIG.actionBgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 1000,
        touchAction: 'none',
        boxShadow: isActive
          ? `0 0 20px ${DEFAULT_CONFIG.hoverGlowColor}, 0 0 40px ${DEFAULT_CONFIG.hoverGlowColor}40`
          : '0 2px 8px rgba(0, 0, 0, 0.2)',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isActive ? DEFAULT_CONFIG.hoverScale : 1,
        opacity: isOpen ? 1 : 0,
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ ...springTransition, delay, duration: DEFAULT_CONFIG.animationDuration / 1000 }}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      role="button"
      aria-label={item.label}
      tabIndex={isOpen ? 0 : -1}
    >
      <i
        className={item.icon}
        style={{
          fontSize: DEFAULT_CONFIG.iconSize,
          color: DEFAULT_CONFIG.actionIconColor,
          transform: isActive ? 'scale(1.15)' : 'scale(1)',
          transition: 'transform 0.2s ease',
        }}
      />
    </motion.div>
  );
};

export const RadialMenu: React.FC<RadialMenuProps> = ({
  items,
  closeDelay = DEFAULT_CONFIG.closeDelay,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = React.useState<{
    isOpen: boolean;
    isPressed: boolean;
    activeId: string | null;
  }>({ isOpen: false, isPressed: false, activeId: null });

  const stateRef = useRef(state);
  stateRef.current = state;

  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const detectActive = useCallback((clientX: number, clientY: number): string | null => {
    const el = containerRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const originX = rect.left;
    const originY = rect.top;

    let closestId: string | null = null;
    let closestDist = Infinity;

    items.forEach((item, index) => {
      const c = getActionCenter(index);
      const dist = Math.sqrt(
        Math.pow(clientX - (originX + c.x), 2) +
        Math.pow(clientY - (originY + c.y), 2)
      );
      if (dist <= A && dist < closestDist) {
        closestDist = dist;
        closestId = item.id;
      }
    });

    return closestId;
  }, [items]);

  const handleDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    clearCloseTimeout();
    setState({ isOpen: true, isPressed: true, activeId: null });
  }, [clearCloseTimeout]);

  const handleMove = useCallback((e: React.PointerEvent) => {
    if (!stateRef.current.isOpen) return;
    setState(prev => ({ ...prev, activeId: detectActive(e.clientX, e.clientY) }));
  }, [detectActive]);

  const handleUp = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}

    const cur = stateRef.current;
    if (cur.activeId) {
      const action = items.find(it => it.id === cur.activeId);
      if (action) {
        action.onClick();
        setState({ isOpen: false, isPressed: false, activeId: null });
        return;
      }
    }

    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setState({ isOpen: false, isPressed: false, activeId: null });
    }, closeDelay);
  }, [items, closeDelay, clearCloseTimeout]);

  const handleActionClick = useCallback((item: RadialMenuItem) => {
    if (!stateRef.current.isOpen) return;
    clearCloseTimeout();
    item.onClick();
    setState({ isOpen: false, isPressed: false, activeId: null });
  }, [clearCloseTimeout]);

  const handleEnter = useCallback((id: string) => {
    if (!stateRef.current.isOpen) return;
    setState(prev => ({ ...prev, activeId: id }));
  }, []);

  const handleLeave = useCallback(() => {
    setState(prev => ({ ...prev, activeId: null }));
  }, []);

  React.useEffect(() => () => clearCloseTimeout(), [clearCloseTimeout]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        width: CONTAINER_W,
        height: CONTAINER_H,
        zIndex: DEFAULT_CONFIG.zIndex,
      }}
    >
      {/* Main menu button */}
      <MainButton
        isOpen={state.isOpen}
        isPressed={state.isPressed}
        onPointerDown={handleDown}
      />

      {/* Full-screen overlay for pointer tracking when open */}
      {state.isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 998,
            touchAction: 'none',
          }}
          onPointerMove={handleMove}
          onPointerUp={handleUp}
        />
      )}

      {/* Action items */}
      <AnimatePresence>
        {state.isOpen && items.map((item, index) => (
          <ActionItem
            key={item.id}
            item={item}
            isActive={state.activeId === item.id}
            isOpen={state.isOpen}
            index={index}
            onClick={() => handleActionClick(item)}
            onPointerEnter={() => handleEnter(item.id)}
            onPointerLeave={handleLeave}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

/**
 * Convenience hook for creating menu items with the standard icons
 */
export const useRadialMenuItems = (
  handlers: {
    onNight?: () => void;
    onMorning?: () => void;
    onProducts?: () => void;
  }
): RadialMenuItem[] => {
  return useMemo(() => {
    const items: RadialMenuItem[] = [];

    if (handlers.onNight) {
      items.push({
        id: 'night',
        icon: 'fa-solid fa-moon',
        label: 'Night',
        onClick: handlers.onNight,
      });
    }

    if (handlers.onMorning) {
      items.push({
        id: 'morning',
        icon: 'fa-solid fa-sun',
        label: 'Morning',
        onClick: handlers.onMorning,
      });
    }

    if (handlers.onProducts) {
      items.push({
        id: 'products',
        icon: 'fa-solid fa-tag',
        label: 'Products',
        onClick: handlers.onProducts,
      });
    }

    return items;
  }, [handlers.onNight, handlers.onMorning, handlers.onProducts]);
};

export default RadialMenu;

export type { RadialMenuProps, RadialMenuItem };