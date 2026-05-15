import type { Config } from 'tailwindcss';
import preset from '@seal/ui/tailwind-preset';

const config: Config = {
  presets: [preset],
  content: ['./src/**/*.{ts,tsx,mdx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  theme: { extend: {} },
};

export default config;
