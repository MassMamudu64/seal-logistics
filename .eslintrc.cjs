/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: ['./packages/ui/tsconfig.json', './apps/site/tsconfig.json'],
  },
  plugins: ['@typescript-eslint', 'jsx-a11y', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/strict',
    'next/core-web-vitals',
    'prettier',
  ],
  settings: { react: { version: 'detect' } },
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    'no-restricted-syntax': [
      'error',
      {
        selector: "CallExpression[callee.object.name='console'][callee.property.name=/^(log|info)$/]",
        message: 'Use the logger or remove console output before commit.',
      },
    ],
  },
  overrides: [
    {
      files: ['packages/ui/**/*.{ts,tsx}'],
      rules: {
        '@next/next/no-html-link-for-pages': 'off',
        '@next/next/no-img-element': 'off',
      },
    },
  ],
  ignorePatterns: ['node_modules', '.next', 'dist', 'coverage', 'playwright-report'],
};
