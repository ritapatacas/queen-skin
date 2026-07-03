/**
 * RadialMenu Types and Configuration
 * 
 * This file defines the TypeScript interfaces and types for the RadialMenu component.
 */

/**
 * Represents a single action item in the radial menu
 */
export interface RadialMenuItem {
  /** Unique identifier for the action */
  id: string;
  /** Font Awesome icon class string (e.g., "fa-solid fa-moon") */
  icon: string;
  /** Display label for the action */
  label: string;
  /** Callback function executed when this action is selected */
  onClick: () => void;
}

/**
 * Configuration for radial positioning of menu items
 */
export interface RadialPositionConfig {
  /** 
   * Radius in pixels from the center button to the action items
   * @default 90
   */
  radius: number;
  /** 
   * Starting angle in degrees (0 = right, 90 = down, 180 = left, 270 = up)
   * @default 0
   */
  startAngle?: number;
  /** 
   * Total arc angle to distribute items across (positive = clockwise)
   * If not specified, items are distributed evenly across 360 degrees
   * @default undefined (full circle distribution)
   */
  arcAngle?: number;
}

/**
 * Animation configuration for the radial menu
 */
export interface RadialAnimationConfig {
  /** 
   * Duration of open/close animations in milliseconds
   * @default 400
   */
  duration?: number;
  /** 
   * Delay before auto-closing when releasing outside an action (ms)
   * @default 300
   */
  closeDelay?: number;
  /** 
   * Spring stiffness for Framer Motion animations (higher = snappier)
   * @default 300
   */
  springStiffness?: number;
  /** 
   * Spring damping for Framer Motion animations
   * @default 20
   */
  springDamping?: number;
  /** 
   * Scale factor for hovered action
   * @default 1.2
   */
  hoverScale?: number;
}

/**
 * Visual styling configuration for the radial menu
 */
export interface RadialStyleConfig {
  /** 
   * Background color of the main button
   * @default "rgba(57, 60, 162, 0.9)"
   */
  buttonBgColor?: string;
  /** 
   * Background color of action items
   * @default "rgba(255, 255, 255, 0.95)"
   */
  actionBgColor?: string;
  /** 
   * Icon color for the main button
   * @default "#ffffff"
   */
  buttonIconColor?: string;
  /** 
   * Icon color for action items
   * @default "#393CA2"
   */
  actionIconColor?: string;
  /** 
   * Glow color for hovered actions
   * @default "rgba(57, 60, 162, 0.4)"
   */
  hoverGlowColor?: string;
  /** 
   * Size of the main button in pixels
   * @default 56
   */
  buttonSize?: number;
  /** 
   * Size of action items in pixels
   * @default 48
   */
  actionSize?: number;
  /** 
   * Size of icons in pixels
   * @default 20
   */
  iconSize?: number;
  /** 
   * Invisible hit radius for easier touch selection (pixels)
   * @default 45
   */
  hitRadius?: number;
}

/**
 * Props for the RadialMenu component
 */
export interface RadialMenuProps {
  /** Array of action items to display in the menu */
  items: RadialMenuItem[];
  
  /** Radial positioning configuration */
  radius?: number;
  
  /** Animation configuration */
  closeDelay?: number;
  animationDuration?: number;
  
  /** Visual styling configuration */
  buttonBgColor?: string;
  actionBgColor?: string;
  buttonIconColor?: string;
  actionIconColor?: string;
  hoverGlowColor?: string;
  buttonSize?: number;
  actionSize?: number;
  iconSize?: number;
  hitRadius?: number;
  
  /** Optional className for additional styling */
  className?: string;
  
  /** Optional z-index (defaults to 1000) */
  zIndex?: number;
}

/**
 * Position of an action item in the radial menu
 */
export interface ActionPosition {
  /** X coordinate relative to menu center */
  x: number;
  /** Y coordinate relative to menu center */
  y: number;
  /** Angle in degrees */
  angle: number;
}

/**
 * State for tracking pointer interaction with the menu
 */
export interface PointerInteractionState {
  /** Whether the pointer is currently pressed */
  isPressed: boolean;
  /** Whether the menu is currently open */
  isOpen: boolean;
  /** ID of the currently hovered action, or null */
  activeActionId: string | null;
  /** Current pointer position relative to menu center */
  pointerPosition: { x: number; y: number } | null;
}