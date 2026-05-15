/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Transpile workspace packages so Next can ship them
  transpilePackages: ['@seal/ui'],
  // Strict TS + ESLint in CI; the build fails on either.
  eslint: { ignoreDuringBuilds: false },
  typescript: { ignoreBuildErrors: false },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // No external image hosts in v1 — only the bundled /public assets
    ],
  },
  experimental: {
    // Keep the server bundle lean. NOTE: framer-motion is excluded — Next 14's
    // barrel optimizer mangles its hooks (useReducedMotion etc.) when the
    // import crosses a workspace boundary.
    optimizePackageImports: ['@seal/ui'],
  },
  // Performance budgets enforced via Lighthouse CI (see lighthouserc.json).
  // Headers are added in middleware.ts so they apply per-request (including CSP nonces).
};

export default nextConfig;
