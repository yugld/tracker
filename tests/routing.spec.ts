import { test, expect } from '@playwright/test';

test('главная страница открывается', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL('/');
});

test('404 отображается для неизвестного маршрута', async ({ page }) => {
  await page.goto('/some-unknown-page');
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
});
