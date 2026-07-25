import { test, expect } from '@playwright/test';

test.describe('Lead Capture Flow', () => {
  test('public user can submit a lead via capture form', async ({ page }) => {
    // Go to the public landing page (or wherever the lead capture form is)
    await page.goto('/');

    // Fill out the form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phone"]', '1234567890');
    await page.fill('input[name="company"]', 'Test Company');
    await page.fill('textarea[name="message"]', 'This is a test message for Playwright.');

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for the success state
    await expect(page.getByText('Thank you!')).toBeVisible();
    await expect(page.getByText('Your inquiry has been submitted.')).toBeVisible();
  });

  test('admin can view the submitted lead in the dashboard', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@leadflow.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Wait for dashboard and verify lead is present
    await page.waitForURL('/dashboard/leads');
    await expect(page).toHaveURL('/dashboard/leads');

    // Check if the lead is in the table
    // Sometimes it takes a moment to fetch
    await expect(page.getByRole('row', { name: /Test User/i }).first()).toBeVisible({ timeout: 10000 });
  });
});
