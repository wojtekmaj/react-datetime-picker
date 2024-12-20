import { afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import 'vitest-canvas-mock';

// Workaround for a bug in Vitest 3 or happy-dom
const IntlNumberFormat = Intl.NumberFormat;

beforeEach(() => {
  Intl.NumberFormat = IntlNumberFormat;
});

afterEach(() => {
  cleanup();
});
