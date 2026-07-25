import { test, expect } from '@playwright/test';

test.describe('Authentication Rules', () => {
  test('unauthenticated user is redirected to login from dashboard', async ({ page }) => {
    // Attempt to access an authenticated route
    await page.goto('/dashboard/leads');
    
    // Should be redirected to login page
    await expect(page).toHaveURL(/\/login/);
    
    // Check if login form is present
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('authenticated user can access dashboard', async ({ page }) => {
    await page.goto('/login');
    
    // Login with the admin credentials seeded in the database
    await page.fill('input[type="email"]', 'admin@leadflow.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Wait for navigation and verify dashboard is accessible
    await page.waitForURL('/dashboard/leads');
    await expect(page).toHaveURL('/dashboard/leads');
    
    // Verify dashboard elements
    await expect(page.getByText('LeadFlow.')).toBeVisible();
  });
});
