import { expect, type Page } from '@playwright/test';

/** Lazy-loaded catalog + data fetch; default 5s is often too tight on CI / cold dev. */
const CATALOG_UI_TIMEOUT_MS = 30_000;

export const waitForCoursesCatalogReady = async (page: Page) => {
  await expect(page.getByRole('button', { name: 'All Courses' })).toBeVisible({
    timeout: CATALOG_UI_TIMEOUT_MS,
  });
};
