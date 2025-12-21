import { test, expect } from '@playwright/test';

test('страница логина доступна', async ({ page }) => {
  await page.goto('/auth');
  await expect(page.locator('form')).toBeVisible();
});
