/**
 * Design tokens — single source of truth for color, type, spacing, motion.
 * Mirrors `tailwind-preset.cjs` 1:1 at the values level. Consumed by the
 * Tailwind preset and exported for runtime use (charts, JSON-LD, motion).
 *
 * The `primary` palette is an alias of `brand`. Both name-spaces are kept
 * because the marketing pages were authored against `brand-*` while the
 * design-system primitives (Button, Footer, Timeline, etc.) speak the more
 * conventional `primary-*` language. One palette, two names.
 */

const BRAND = {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb',
  700: '#1d4ed8',
  800: '#1e3a8a',
  900: '#172554',
  950: '#0a0f2c',
} as const;

const ACCENT = {
  50: '#fff7ed',
  100: '#ffedd5',
  200: '#fed7aa',
  300: '#fdba74',
  400: '#fb923c',
  500: '#f97316',
  600: '#ea580c',
  700: '#c2410c',
  800: '#9a3412',
  900: '#7c2d12',
} as const;

export const colors = {
  brand: BRAND,
  primary: BRAND, // alias
  accent: ACCENT,
  neutral: {
    0: '#ffffff',
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  success: '#16a34a',
  warning: '#d97706',
  danger: '#dc2626',
} as const;

export const spacing = {
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  6: '1.5rem',
  8: '2rem',
  12: '3rem',
  16: '4rem',
  24: '6rem',
  32: '8rem',
} as const;

export const radii = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '9999px',
} as const;

export const shadows = {
  soft: '0 1px 2px rgba(15, 23, 42, 0.04), 0 2px 8px rgba(15, 23, 42, 0.06)',
  medium: '0 6px 16px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.05)',
  bloom: '0 24px 60px -20px rgba(15, 23, 42, 0.18)',
  glow: '0 0 0 1px rgba(255, 255, 255, 0.04), 0 20px 40px -16px rgba(37, 99, 235, 0.35)',
} as const;

export const typography = {
  fontFamily: {
    sans: ['Inter Variable', 'system-ui', 'sans-serif'],
    display: ['"Space Grotesk Variable"', 'Inter Variable', 'sans-serif'],
    mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
  },
  // Modular scale 1.25 — anchored at 16px body.
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.875rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1.1' }],
    '6xl': ['3.75rem', { lineHeight: '1.05' }],
  },
} as const;

export const motion = {
  // GPU-friendly defaults: only transform + opacity. Durations under 400ms.
  duration: { fast: 0.16, base: 0.24, slow: 0.36 },
  durationMs: { fast: 160, base: 240, slow: 360 },
  ease: {
    // expo-out — used for entrances, hover lifts, scroll reveals.
    out: [0.16, 1, 0.3, 1] as const,
    inOut: [0.65, 0, 0.35, 1] as const,
  },
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const maxWidth = {
  content: '78rem',
  prose: '42rem',
} as const;
