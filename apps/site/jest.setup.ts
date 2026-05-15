import '@testing-library/jest-dom';

// Deterministic crypto for tracking tests
process.env.PORTAL_TOKEN_SECRET =
  process.env.PORTAL_TOKEN_SECRET || 'test-secret-test-secret-test-secret-test';
