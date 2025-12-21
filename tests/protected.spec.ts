import { test, expect } from '@playwright/test';

test('редирект на /auth если не авторизован', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/auth/);
});
