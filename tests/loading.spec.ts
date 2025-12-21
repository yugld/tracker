import { test, expect } from '@playwright/test';

test('показывается loader при переходе', async ({ page }) => {
  await page.goto('/');

  await page.click('a[href="/dashboard"]');

  await expect(page.locator('[data-testid="loading"]')).toBeVisible();
});
