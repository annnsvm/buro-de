import { expect, test } from '@playwright/test';

test('home page renders hero', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByLabel('Hero Title')).toBeVisible();
});
