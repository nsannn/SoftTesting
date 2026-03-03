const { test, expect } = require('@playwright/test');

const TEST_URL = 'https://demoqa.com/dynamic-properties';

test('TC-DP-001: Dynamic Properties Widget Test', async ({ page }) => {
    // Step 1: Navigate to Dynamic Properties page
    await page.goto(TEST_URL);

    // Locators
    const enableAfterButton = page.locator('#enableAfter');
    const visibleAfterButton = page.locator('#visibleAfter');
    const colorChangeButton = page.locator('#colorChange');

    // Step 2 - Verification 1: "Will enable 5 seconds" button is initially disabled
    await expect(enableAfterButton).toBeDisabled();

    // Step 3 - Verification 2: "Visible After 5 Seconds" button is initially not visible
    await expect(visibleAfterButton).not.toBeVisible();

    // Step 4: Wait for "Will enable 5 seconds" button to become enabled
    await expect(enableAfterButton).toBeEnabled({ timeout: 10000 });

    // Step 5 - Verification 3: "Will enable 5 seconds" button is now enabled
    await expect(enableAfterButton).toBeEnabled();

    // Step 6 & 7 - Verification 4: "Visible After 5 Seconds" button becomes visible
    await expect(visibleAfterButton).toBeVisible({ timeout: 10000 });

    // Step 8 - Verification 5: "Color Change" button has changed color (has 'text-danger' class)
    await expect(colorChangeButton).toHaveClass(/text-danger/, { timeout: 10000 });
});

// npx playwright test dynamicProperties --headed