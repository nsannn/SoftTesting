const { test, expect } = require('@playwright/test');

const TEST_URL = 'https://demoqa.com/progress-bar';

test('TC-PB-001: Progress Bar Widget Synchronization Test', async ({ page }) => {
    // Step 1: Navigate to Progress Bar page
    await page.goto(TEST_URL);
    const progressBar = page.locator('#progressBar .progress-bar');

    // Step 2 - Verification 1: Progress bar is initially at 0%
    await expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    await expect(progressBar).toHaveText('0%');

    // Step 3 - Verification 2: Start button is visible and enabled
    const startButton = page.getByRole('button', { name: 'Start' });
    await expect(startButton).toBeVisible();
    await expect(startButton).toBeEnabled();

    // Step 4: Click Start button to begin progress
    await startButton.click();

    // Step 5: Wait for progress bar to reach 100%
    await expect(progressBar).toHaveAttribute('aria-valuenow', '100', { timeout: 15000 });

    // Step 6 - Verification 3: Progress bar displays 100%
    await expect(progressBar).toHaveText('100%');

    // Step 7 - Verification 4: Button text has changed to "Reset"
    const resetButton = page.getByRole('button', { name: 'Reset' });
    await expect(resetButton).toBeVisible();

    // Step 8: Click the Reset button
    await resetButton.click();

    // Step 9 - Verification 5: Progress bar has reset to 0%
    await expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    await expect(progressBar).toHaveText('0%');

    // Step 10 - Verification 6: Button text has changed back to "Start"
    await expect(startButton).toBeVisible();
});

// npx playwright test progressBarSync --headed