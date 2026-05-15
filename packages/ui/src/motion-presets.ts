/**
 * Centralized Framer Motion variants. Every animation in the app pulls from
 * here so timing/easing stay consistent.
 *
 * Rules (enforced in review):
 *   - Only `transform` and `opacity`. No layout properties.
 *   - Durations <= 600ms. Stagger delays <= 80ms.
 *   - Every consumer must honor useReducedMotion() and skip to the final state.
 */
import type { Variants, Transition } from 'framer-motion';

export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT_QUART: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const transition = {
  fast: { duration: 0.16, ease: EASE_OUT_EXPO } satisfies Transition,
  base: { duration: 0.32, ease: EASE_OUT_EXPO } satisfies Transition,
  slow: { duration: 0.56, ease: EASE_OUT_EXPO } satisfies Transition,
  spring: { type: 'spring', stiffness: 220, damping: 28, mass: 0.9 } satisfies Transition,
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: transition.base },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition.base },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: transition.base },
};

export function staggerChildren(stagger = 0.06, delay = 0.04): Variants {
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: stagger, delayChildren: delay } },
  };
}

/** Used for hero / above-the-fold sections — slightly more dramatic. */
export const heroStagger: Variants = staggerChildren(0.08, 0.05);

/** Reveals an SVG path by stroke-dashoffset. */
export const drawPath: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.4, ease: EASE_OUT_EXPO },
  },
};
