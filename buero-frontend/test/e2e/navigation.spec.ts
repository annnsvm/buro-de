import { expect, test } from '@playwright/test';

import { installCatalogApiMocks } from './helpers/mockBackend';
import { waitForCoursesCatalogReady } from './helpers/waitForCoursesCatalog';

test.describe('Main navigation', () => {
  test.beforeEach(async ({ page }) => {
    await installCatalogApiMocks(page);
  });

  test('opens Courses from header on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Courses' })
      .click();

    await expect(page).toHaveURL(/\/courses$/);
    await waitForCoursesCatalogReady(page);
    await expect(page.getByText('2 courses found')).toBeVisible();
  });
});
