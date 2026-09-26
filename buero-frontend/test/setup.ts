import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';

import { server } from './mocks/server';

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
  /**
   * Testing Library only unmounts by itself when Vitest runs with `globals`, which this
   * project does not. Without this, every render stays in the document and a query that
   * looks across the page finds the previous test's markup as well as this one's.
   */
  cleanup();
});

afterAll(() => {
  server.close();
});
