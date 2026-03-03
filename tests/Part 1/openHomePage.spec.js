const {test, expect} = require('@playwright/test');

test('Open home page', async ({page}) => {
    await page.goto('https://demowebshop.tricentis.com/');
    await expect(page).toHaveTitle('Demo Web Shop');
});

// npx playwright test --headed
