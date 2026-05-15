import { test, expect } from '@playwright/test';

test.describe('Customer portal', () => {
  test('rejects an invalid tracking ID at the lookup page', async ({ page }) => {
    await page.goto('/portal');
    await page.getByLabel(/tracking id/i).fill('NOT-A-VALID-ID');
    await page.getByRole('button', { name: /view shipment/i }).click();
    await expect(page).toHaveURL(/\/portal\?error=invalid/);
  });

  test('renders a shipment timeline for a freshly issued tracking ID', async ({
    page,
    request,
  }) => {
    // Submit a booking via the API to get a valid signed ID, then visit the portal.
    const res = await request.post('/api/quote', {
      data: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+1 555 111 2222',
        from: 'US',
        to: 'NG',
        weight: 15,
        company_website: '',
        consent: true,
      },
    });
    expect(res.ok()).toBeTruthy();
    const body = (await res.json()) as { ok: true; trackingId: string };

    await page.goto(`/portal/shipment/${body.trackingId}`);
    await expect(page.getByRole('heading', { name: body.trackingId })).toBeVisible();
    await expect(page.getByText(/timeline/i)).toBeVisible();
  });
});
