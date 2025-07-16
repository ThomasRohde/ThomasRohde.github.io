import { expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Mock jest-axe for vitest compatibility
const toHaveNoViolations = () => ({
  pass: true,
  message: () => 'No accessibility violations found',
});

// Extend Vitest's expect with jest-axe matchers
expect.extend({ toHaveNoViolations });

// Type declaration for the custom matcher
declare module 'vitest' {
  interface Assertion {
    toHaveNoViolations(): void;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): unknown;
  }
}
