import { test, expect } from '@playwright/test';

const TEST_URL = 'https://demoqa.com/';

test('Pagination resets to one page after deleting last row on page 2', async ({ page }) => {

  // Step 1: Open site
  await page.goto(TEST_URL);
  await expect(page).toHaveTitle('demosite');

  // Step 2: Navigate to Web Tables
  await page.locator('.card-body', { hasText: 'Elements' }).click();
  await page.getByText('Web Tables').click();

//   // Ensure table body is rendered
 await page.locator('[title="Delete"]').first().waitFor();

  // Step 3: Get default rows-per-page value
  const rowsPerPage = Number(
    await page.locator('select.form-control').inputValue()
  );

  // Step 4: Count only real data rows (rows that contain a delete button)
  const existingRows = await page.locator('[title="Delete"]').count();

  console.log(`Rows per page: ${rowsPerPage}`);
  console.log(`Existing real rows: ${existingRows}`);

  // Step 5: Calculate rows to add
  const rowsToAdd = rowsPerPage - existingRows + 1;

  for (let i = 0; i < rowsToAdd; i++) {
    await page.getByRole('button', { name: 'Add' }).click();

    await page.locator('#firstName').fill(`Test${Date.now()}${i}`);
    await page.locator('#lastName').fill(`User${Date.now()}${i}`);
    await page.locator('#userEmail').fill(`test${Date.now()}${i}@mail.com`);
    await page.locator('#age').fill('30');
    await page.locator('#salary').fill('50000');
    await page.locator('#department').fill('QA');

    await page.getByRole('button', { name: 'Submit' }).click();
  }

  // Step 6: Verify page 2 exists
  await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled();
  await expect(page.getByText(/Page 1 of 2/)).toBeVisible();

  // Step 7: Go to page 2
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText(/Page 2 of 2/)).toBeVisible();

  // Step 8: Delete first row on page 2 (use evaluate to bypass ad overlays)
  await page.locator('[title="Delete"]').first().evaluate(el => el.click());

  // Step 9: Verify pagination reset
  await expect(page.getByText(/Page 1 of 1/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next' })).toBeDisabled();
});

// npx playwright test additionalTestCase --headed