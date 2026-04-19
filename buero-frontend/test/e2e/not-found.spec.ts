import { expect, test } from '@playwright/test';

test('unknown route shows 404 page', async ({ page }) => {
  await page.goto('/this-route-does-not-exist-e2e');

  await expect(page.getByLabel('Not Found Page')).toBeVisible();
  await expect(page.getByRole('heading', { name: /wrong turn/i })).toBeVisible();
});
