import { test, expect, Page } from '@playwright/test';
import { Buffer } from 'buffer';

/**
 * Reusable Login Logic
 */
async function login(page: Page, email: string, password: string) {
  await page.goto('/login', { waitUntil: 'networkidle' });
  await page.getByPlaceholder('name@example.com').fill(email);
  await page.getByPlaceholder('Enter your password').fill(password);
  
  await Promise.all([
    page.waitForURL(/.*dashboard.*/),
    page.waitForLoadState('networkidle'), 
    page.getByRole('button', { name: 'Login to Dashboard' }).click(),
  ]);
  await expect(page.locator('app-dashboard')).toBeVisible();
}

test.describe('G5ConfEase Sequential Business Flow', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(300000); 

  let uniqueAuthorEmail: string;

  test.beforeAll(async () => {
    uniqueAuthorEmail = `author_${Date.now()}@test.com`;
  });

  test('Step 1: Super Admin - User and Conference Setup', async ({ page }) => {
    await login(page, 'superadmin@test.com', 'super123456');

    // 1. Create Secondary Admin
    await page.getByRole('link', { name: 'Access Provisioning' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByPlaceholder('Enter first name').fill('Secondary');
    await page.getByPlaceholder('Enter last name').fill('Admin');
    await page.getByPlaceholder('admin@confease.com').fill('assigned_admin@gmail.com');
    await page.getByPlaceholder('Minimum 8 characters').fill('password123');
    await page.getByRole('button', { name: 'Generate Admin Account' }).click();
    await expect(page.getByText(/successfully|created/i)).toBeVisible();

    // 2. Create Track
    await page.getByRole('link', { name: 'Manage Track' }).click();
    await page.waitForLoadState('networkidle');
    await page.getByPlaceholder(/Cloud Computing/i).fill('Artificial Intelligence');
    await page.getByRole('button', { name: 'Create Track' }).click();
    await expect(page.getByText('Artificial Intelligence')).toBeVisible();

    // 3. Create Conference - WITH NAVIGATION GUARD
    await page.getByRole('link', { name: 'Conference Management' }).click();
    
    // Wait for the "New Conference" button to be stable and click
    const newConfBtn = page.getByRole('link', { name: 'New Conference' });
    await newConfBtn.waitFor({ state: 'visible' });
    await newConfBtn.click();

    // CRITICAL: Wait for the URL or a unique element on the New Conference page
    await page.waitForURL(/.*create-conference.*/).catch(() => console.log('URL did not change, staying on current page.'));
    await page.waitForLoadState('networkidle');

    // Use broader locators in case "Title" is a label and not a placeholder
    const titleInput = page.locator('input[name="title"], [placeholder*="Title"]');
    await titleInput.waitFor({ state: 'visible', timeout: 10000 });
    await titleInput.fill('Artificial Intelligence Summit 2026');

    await page.getByPlaceholder(/e.g., ISAI 2025/i).fill('AIS26');
    await page.locator('input[name="location"]').fill('University Hall');
    await page.locator('textarea[name="description"]').fill('Standard E2E Test Conference');
    await page.locator('input[name="start_date"]').fill('2026-12-31');

    const createBtn = page.getByRole('button', { name: 'Create Conference' });
    
    // Ensure form is valid and button is clickable
    await expect(createBtn).toBeEnabled();

    await Promise.all([
      page.waitForResponse(res => res.url().includes('/conferences') && res.status() < 400),
      createBtn.click()
    ]);

    await expect(page.getByText('AIS26')).toBeVisible({ timeout: 15000 });
  });

  test('Step 2: Author - Submission and Reviewer Application', async ({ page }) => {
    await page.goto('/register');
    await page.getByPlaceholder('First Name').fill('Jen');
    await page.getByPlaceholder('Last Name').fill('Tester');
    await page.getByPlaceholder('name@example.com').fill(uniqueAuthorEmail);
    await page.locator('input[type="password"]').first().fill('password123');
    await page.locator('input[type="password"]').last().fill('password123');
    await page.getByRole('button', { name: 'Sign Up' }).click();

    await login(page, uniqueAuthorEmail, 'password123');

    await page.getByRole('link', { name: 'New Submission' }).click();
    await page.waitForLoadState('networkidle');
    
    // Select the conference created in Step 1
    await page.selectOption('select#confSelect', { 
      label: 'AIS26 — Artificial Intelligence Summit 2026' 
    });

    // Select Research Track by the name
    await page.selectOption('select#trackSelect', { 
      label: 'Artificial Intelligence' 
    });

    await page.getByPlaceholder('Paper Title').fill('E2E Test Results');
    await page.locator('#abstractText').fill('Automated E2E abstract content.');
    
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.locator('input[type="file"]').first().click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({ 
        name: 'paper.pdf', 
        mimeType: 'application/pdf', 
        buffer: Buffer.from('PDF Content') 
    });
  

    await Promise.all([
        // This ensures we wait for the actual POST request to the API
        page.waitForResponse(res => res.request().method() === 'POST', { timeout: 10000 }),
        page.getByRole('button', { name: 'Submit Research' }).click()
    ]);

    // 3. Reviewer Application Flow
    await page.getByRole('link', { name: 'Profile' }).click();
    await page.getByRole('button', { name: 'Apply for Reviewer Role' }).click();
    await page.getByPlaceholder(/expertise/i).fill('Research Automation');
    
    const evidencePromise = page.waitForEvent('filechooser');
    await page.locator('input[type="file"]').click();
    const evidenceChooser = await evidencePromise;
    await evidenceChooser.setFiles({ name: 'cv.pdf', mimeType: 'application/pdf', buffer: Buffer.from('CV Content') });
    
    await page.getByRole('button', { name: 'Submit Application' }).click();
  });
});