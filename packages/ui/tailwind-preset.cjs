/**
 * Tailwind preset — the single source of truth for the Seal Logistics design
 * system at the CSS layer. The TypeScript mirror lives in `src/tokens.ts`
 * (covered by tokens.test.ts). Any token added here must be added there too.
 *
 * CJS so Tailwind (which loads configs synchronously) can require it from
 * any consumer.
 *
 * Why two name-spaces (brand + primary):
 *   "brand-*" is the original palette name used throughout the marketing
 *   pages. "primary-*" is the more conventional design-system name used by
 *   the newer component layer (Button, Footer, Timeline, etc.). Both alias
 *   the same hex values so either convention compiles. Pick `brand-*` for
 *   new marketing code; `primary-*` is preserved for the design-system
 *   primitives.
 */

const BRAND = {
  50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
  400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
  800: '#1e3a8a', 900: '#172554', 950: '#0a0f2c',
  DEFAULT: '#2563eb',
};

const ACCENT = {
  50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74',
  400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c',
  800: '#9a3412', 900: '#7c2d12',
  DEFAULT: '#f97316',
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    screens: {
      sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px',
    },
    extend: {
      colors: {
        brand: BRAND,
        primary: BRAND, // alias — both name-spaces resolve to the same hex
        accent: ACCENT,
        success: '#16a34a',
        warning: '#d97706',
        danger:  '#dc2626',
      },
      borderRadius: {
        sm: '0.25rem', md: '0.5rem', lg: '0.75rem',
        xl: '1rem', '2xl': '1.5rem',
      },
      fontFamily: {
        sans: ['Inter Variable', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk Variable"', 'Inter Variable', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      // Motion tokens — match motion-presets.ts on the JS side.
      transitionDuration: {
        fast: '160ms',
        base: '240ms',
        slow: '360ms',
      },
      transitionTimingFunction: {
        'out-expo':    'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-quart': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      // Shadows — soft for resting cards; medium for hover lift;
      // bloom for cinematic dark backgrounds.
      boxShadow: {
        soft:   '0 1px 2px rgba(15, 23, 42, 0.04), 0 2px 8px rgba(15, 23, 42, 0.06)',
        medium: '0 6px 16px rgba(15, 23, 42, 0.08), 0 2px 6px rgba(15, 23, 42, 0.05)',
        bloom:  '0 24px 60px -20px rgba(15, 23, 42, 0.18)',
        // For dark sections that want a subtle glow under cards.
        glow:   '0 0 0 1px rgba(255, 255, 255, 0.04), 0 20px 40px -16px rgba(37, 99, 235, 0.35)',
      },
      maxWidth: {
        content: '78rem', // 1248px — the canonical page-content width
        prose:   '42rem',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translate3d(0, 12px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
      },
      animation: {
        'fade-up':    'fade-up 240ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // Container utility used by the @seal/ui Footer + page shells.
    function ({ addComponents, theme }) {
      addComponents({
        '.container-content': {
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%',
          maxWidth: theme('maxWidth.content'),
          paddingLeft: theme('spacing.6'),
          paddingRight: theme('spacing.6'),
          '@screen lg': {
            paddingLeft: theme('spacing.8'),
            paddingRight: theme('spacing.8'),
          },
        },
      });
    },
  ],
};
