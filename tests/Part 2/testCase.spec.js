import { test, expect } from '@playwright/test';

const TEST_URL = 'https://demowebshop.tricentis.com';
const PRICE_THRESHOLD = 800;

const EMAIL = `testuser_${Date.now()}@test.com`;
const PASSWORD = 'Test1234!';

test('TC-DWS-001: Shopping cart management for desktops ≤ $800', async ({ page }) => {
    test.setTimeout(90000);

    // Step 1: Open homepage
    await page.goto(TEST_URL);

    // Verification 1: Homepage loaded correctly
    await expect(page).toHaveTitle('Demo Web Shop');

    // Step 2: Click Register in the header
    await page.locator('.header-links a[href="/register"]').click();

    // Step 3: Fill registration form
    await page.locator('#gender-male').check();
    await page.locator('#FirstName').fill('John');
    await page.locator('#LastName').fill('Doe');
    await page.locator('#Email').fill(EMAIL);
    await page.locator('#Password').fill(PASSWORD);
    await page.locator('#ConfirmPassword').fill(PASSWORD);

    // Step 4: Submit registration
    await page.locator('#register-button').click();

    // Verification 2: Registration succeeded
    await expect(page.locator('.result')).toHaveText('Your registration completed');

    await page.locator('.register-continue-button').click();

    // Step 5: Click Computers in the top menu
    await page.locator('.top-menu a[href="/computers"]').click();

    // Step 6: Select Desktops sub-category
    await page.locator('a[href="/desktops"]').first().click();
    await expect(page).toHaveURL(/.*\/desktops/);

    // Steps 7–8: Dynamically identify desktops with price ≤ 800

    const productItems = page.locator('.product-item');
    const productCount = await productItems.count();

    const affordableProducts = [];
    for (let i = 0; i < productCount; i++) {
        const item = productItems.nth(i);
        const name = await item.locator('.product-title a').innerText();
        const priceText = await item.locator('.actual-price').innerText();
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

        // Only include products that are ≤ threshold AND have an "Add to cart" button
        const hasAddToCart = await item.locator('.product-box-add-to-cart-button').count() > 0;

        if (price <= PRICE_THRESHOLD && hasAddToCart) {
            affordableProducts.push({ name, price });
        }
    }

    // Verification 3: At least 2 products found with price ≤ 800
    expect(affordableProducts.length).toBeGreaterThanOrEqual(2);

    // Step 9: Click on the first affordable product
    await page.getByRole('link', { name: affordableProducts[0].name }).first().click();

    // Step 10: Configure required product options for first item
    await page.locator('#product_attribute_72_5_18_53').check();  // Processor: Medium
    await page.locator('#product_attribute_72_6_19_54').check();  // RAM: 2 GB
    await page.locator('#product_attribute_72_3_20_57').check();  // HDD: 320 GB

    // Step 11: Add first item to cart
    await page.locator('.add-to-cart-button').click();
    await expect(page.locator('#bar-notification')).toContainText(
        'The product has been added to your',
        { timeout: 10000 }
    );

    // Step 12: Return to Desktops
    await page.goto(TEST_URL + '/desktops');

    // Step 13–14: Identify and click on the second affordable product
    await page.getByRole('link', { name: affordableProducts[1].name }).first().click();

    // Step 15: Configure required product options for second item
    await page.locator('#product_attribute_75_5_31_96').check();  
    await page.locator('#product_attribute_75_6_32_100').check(); 
    await page.locator('#product_attribute_75_3_33_102').check(); 

    // Step 16: Add second item to cart
    await page.locator('.add-to-cart-button').click();
    await expect(page.locator('#bar-notification')).toContainText(
        'The product has been added to your',
        { timeout: 10000 }
    );

    // Step 17: Open the Shopping Cart
    await page.locator('.header-links a[href="/cart"]').click();
    await expect(page).toHaveURL(/.*\/cart/);

    // Step 18: Verify cart has exactly 2 items
    const cartRows = page.locator('.cart-item-row');

    // Verification 4: Cart contains exactly 2 items
    await expect(cartRows).toHaveCount(2);

    // Step 19: Change first item quantity to 2
    const firstUnitPriceText = await cartRows.first().locator('.product-unit-price').innerText();
    const firstUnitPrice = parseFloat(firstUnitPriceText.replace(/[^0-9.]/g, ''));

    await cartRows.first().locator('.qty-input').fill('2');

    // Step 20: Update the cart
    await page.locator('input[name="updatecart"]').click();

    // Confirm the quantity field now shows 2
    await expect(cartRows.first().locator('.qty-input')).toHaveValue('2');

    // Step 21: Verify the **Sub-Total** updates correctly based on the new quantity.
    // Verification 5 (Arithmetic): Sub-Total = UnitPrice × 2
    const firstSubTotalText = await cartRows.first().locator('.product-subtotal').innerText();
    const firstSubTotal = parseFloat(firstSubTotalText.replace(/[^0-9.]/g, ''));
    const expectedSubTotal = firstUnitPrice * 2;

    expect(firstSubTotal).toBeCloseTo(expectedSubTotal, 2);

    // Steps 22: Remove the second item
    await cartRows.nth(1).locator('input[name="removefromcart"]').check();

    // Step 23: Update the cart
    await page.locator('input[name="updatecart"]').click();

    // Step 24: Verify that only one item is in the cart
    // Verification 6: Only 1 item remains in cart
    await expect(page.locator('.cart-item-row')).toHaveCount(1);

    // Step 25: Log out
    await page.locator('.header-links a[href="/logout"]').click();

    // Verification 7: User is logged out
    await expect(page.locator('.header-links a[href="/register"]')).toBeVisible();
});

// // npx playwright test testCase --headed