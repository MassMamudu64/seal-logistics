/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@seal/ui$': '<rootDir>/../../packages/ui/src/index.ts',
    '^@seal/ui/(.*)$': '<rootDir>/../../packages/ui/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.test.json' }],
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/tests-e2e/'],
  collectCoverageFrom: [
    'src/lib/**/*.{ts,tsx}',
    'src/components/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    './src/lib/pricing.ts': { branches: 90, functions: 90, lines: 90, statements: 90 },
    './src/lib/validation.ts': { branches: 90, functions: 90, lines: 90, statements: 90 },
    './src/lib/tracking.ts': { branches: 85, functions: 90, lines: 90, statements: 90 },
  },
};

module.exports = config;
