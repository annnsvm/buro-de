import { expect, test } from '@playwright/test';

import { installCatalogApiMocks } from './helpers/mockBackend';
import { waitForCoursesCatalogReady } from './helpers/waitForCoursesCatalog';

test.describe('Courses catalog filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await installCatalogApiMocks(page);
    await page.goto('/courses', { timeout: 60_000, waitUntil: 'domcontentloaded' });
    await waitForCoursesCatalogReady(page);
  });

  test('Beginner tab shows only matching course', async ({ page }) => {
    await page.getByRole('button', { name: 'Beginner' }).click();
    await expect(page.getByText('1 course found')).toBeVisible();
    await expect(page.getByText('E2E Course Alpha')).toBeVisible();
    await expect(page.getByText('E2E Course Beta')).not.toBeVisible();
  });

  test('Language tab shows only course with Language tag', async ({ page }) => {
    await page.getByRole('button', { name: 'Language' }).click();
    await expect(page.getByText('1 course found')).toBeVisible();
    await expect(page.getByText('E2E Course Beta')).toBeVisible();
    await expect(page.getByText('E2E Course Alpha')).not.toBeVisible();
  });

  test('Advanced tab filters by level B2', async ({ page }) => {
    await page.getByRole('button', { name: 'Advanced' }).click();
    await expect(page.getByText('1 course found')).toBeVisible();
    await expect(page.getByText('E2E Course Beta')).toBeVisible();
  });

  test('Middle tab shows empty when no B1 courses', async ({ page }) => {
    await page.getByRole('button', { name: 'Middle' }).click();
    await expect(page.getByText('0 courses found')).toBeVisible();
    await expect(page.getByText('No courses found. Try adjusting your filters.')).toBeVisible();
  });
});
