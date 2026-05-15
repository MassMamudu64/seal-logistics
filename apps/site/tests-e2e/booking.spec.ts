import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Booking flow', () => {
  test('happy path: submit and receive tracking ID', async ({ page }) => {
    await page.goto('/quote');
    await expect(page.getByRole('heading', { name: /get an instant quote/i })).toBeVisible();

    await page.getByLabel(/full name/i).fill('Ada Lovelace');
    await page.getByLabel(/email/i).fill('ada@example.com');
    await page.getByLabel(/phone/i).fill('+1 555 123 4567');
    await page.getByLabel(/estimated weight/i).fill('20');
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: /get my quote/i }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('div.font-mono')).toContainText(/^SEAL-/);
  });

  test('rejects honeypot-triggered submissions silently', async ({ page }) => {
    await page.goto('/quote');
    await page.getByLabel(/full name/i).fill('Bot');
    await page.getByLabel(/email/i).fill('bot@example.com');
    await page.getByLabel(/phone/i).fill('+1 555 000 0000');
    await page.getByLabel(/estimated weight/i).fill('15');
    await page.locator('#company_website').fill('http://evil.example');
    await page.getByRole('checkbox').check();
    await page.getByRole('button', { name: /get my quote/i }).click();

    // Spam path: server returns 400; UI shows the error, no success dialog.
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('quote page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/quote');
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    expect(
      results.violations.filter((v) => ['critical', 'serious'].includes(v.impact ?? '')),
    ).toEqual([]);
  });
});
