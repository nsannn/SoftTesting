const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Load test data from external JSON file
const testDataPath = path.join(__dirname, 'Input data', 'testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
const BASE_URL = testData.baseUrl;

// Precondition functions

async function precondition_registerUser(page, userData) {
    const email = `testuser_${Date.now()}@test.com`;
    
    await page.locator('.header-links a[href="/register"]').click();
    
    // Select gender from test data
    if (userData.gender === 'male') {
        await page.locator('#gender-male').check();
    } else {
        await page.locator('#gender-female').check();
    }
    
    await page.locator('#FirstName').fill(userData.firstName);
    await page.locator('#LastName').fill(userData.lastName);
    await page.locator('#Email').fill(email);
    await page.locator('#Password').fill(userData.password);
    await page.locator('#ConfirmPassword').fill(userData.password);
    
    await page.locator('#register-button').click();
    
    // Verify registration success
    await expect(page.locator('.result')).toHaveText('Your registration completed');
    await page.locator('.register-continue-button').click();
    
    return email;
}

async function precondition_ensureEmptyCart(page) {
    await page.locator('.header-links a[href="/cart"]').click();
    
    // Check if cart has items and remove them
    const cartItems = page.locator('.cart-item-row');
    const itemCount = await cartItems.count();
    
    if (itemCount > 0) {
        const removeCheckboxes = page.locator('input[name="removefromcart"]');
        const checkboxCount = await removeCheckboxes.count();
        for (let i = 0; i < checkboxCount; i++) {
            await removeCheckboxes.nth(i).check();
        }
        await page.locator('input[name="updatecart"]').click();
    }
    
    // Verify cart is empty
    await expect(page.locator('.order-summary-content')).toContainText('Your Shopping Cart is empty!');
}

// Postcondition functions

async function postcondition_cleanupCart(page) {
    await page.locator('.header-links a[href="/cart"]').click();
    
    const cartItems = page.locator('.cart-item-row');
    const itemCount = await cartItems.count();
    
    if (itemCount > 0) {
        const removeCheckboxes = page.locator('input[name="removefromcart"]');
        const checkboxCount = await removeCheckboxes.count();
        for (let i = 0; i < checkboxCount; i++) {
            await removeCheckboxes.nth(i).check();
        }
        await page.locator('input[name="updatecart"]').click();
    }
    
    // Verify cart is cleaned up
    await expect(page.locator('.order-summary-content')).toContainText('Your Shopping Cart is empty!');
}

async function postcondition_logout(page) {
    await page.locator('.header-links a[href="/logout"]').click();
    // Verify logout success
    await expect(page.locator('.header-links a[href="/register"]')).toBeVisible();
}

const testCase = testData.testCases[0];

test(`${testCase.testId}: Shopping cart management for desktops ≤ $${testCase.priceThreshold}`, async ({ page }) => {
    test.setTimeout(90000);

    // Preconditions (register user with data from JSON, verify that cart is empty)
    
    // Step 1: Open homepage
    await page.goto(BASE_URL);

    // Verification 1: Homepage loaded correctly
    await expect(page).toHaveTitle('Demo Web Shop');

    // Precondition 1: Register user with data from external JSON file
    await precondition_registerUser(page, testCase.user);

    // Precondition 2: Ensure cart is empty
    await precondition_ensureEmptyCart(page);

    // Test Steps

    // Step 5: Click Computers in the top menu
    await page.locator('.top-menu a[href="/computers"]').click();

    // Step 6: Select Desktops sub-category
    await page.locator('a[href="/desktops"]').first().click();
    await expect(page).toHaveURL(/.*\/desktops/);

    // Steps 7–8: Dynamically identify desktops with price ≤ threshold (from JSON)
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

        if (price <= testCase.priceThreshold && hasAddToCart) {
            affordableProducts.push({ name, price });
        }
    }

    // Verification 2: At least 2 products found with price ≤ threshold
    expect(affordableProducts.length).toBeGreaterThanOrEqual(2);

    // Step 9: Click on the first affordable product
    await page.getByRole('link', { name: affordableProducts[0].name }).first().click();

    // Step 10: Configure required product options for first item (selectors from JSON)
    const firstProduct = testCase.products[0];
    await page.locator(firstProduct.configuration.processor).check();
    await page.locator(firstProduct.configuration.ram).check();
    await page.locator(firstProduct.configuration.hdd).check();

    // Step 11: Add first item to cart
    await page.locator('.add-to-cart-button').click();
    await expect(page.locator('#bar-notification')).toContainText(
        'The product has been added to your',
        { timeout: 10000 }
    );

    // Step 12: Return to Desktops
    await page.goto(BASE_URL + '/desktops');

    // Step 13–14: Identify and click on the second affordable product
    await page.getByRole('link', { name: affordableProducts[1].name }).first().click();

    // Step 15: Configure required product options for second item (selectors from JSON)
    const secondProduct = testCase.products[1];
    await page.locator(secondProduct.configuration.processor).check();
    await page.locator(secondProduct.configuration.ram).check();
    await page.locator(secondProduct.configuration.hdd).check();

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

    // Verification 3: Cart contains exactly 2 items
    await expect(cartRows).toHaveCount(2);

    // Step 19: Change first item quantity (value from JSON)
    const firstUnitPriceText = await cartRows.first().locator('.product-unit-price').innerText();
    const firstUnitPrice = parseFloat(firstUnitPriceText.replace(/[^0-9.]/g, ''));

    await cartRows.first().locator('.qty-input').fill(String(testCase.cartOperations.updateQuantity));

    // Step 20: Update the cart
    await page.locator('input[name="updatecart"]').click();

    // Confirm the quantity field now shows updated value
    await expect(cartRows.first().locator('.qty-input')).toHaveValue(String(testCase.cartOperations.updateQuantity));

    // Step 21: Verify the Sub-Total updates correctly based on the new quantity
    // Verification 4 (Arithmetic): Sub-Total = UnitPrice × quantity
    const firstSubTotalText = await cartRows.first().locator('.product-subtotal').innerText();
    const firstSubTotal = parseFloat(firstSubTotalText.replace(/[^0-9.]/g, ''));
    const expectedSubTotal = firstUnitPrice * testCase.cartOperations.updateQuantity;

    expect(firstSubTotal).toBeCloseTo(expectedSubTotal, 2);

    // Steps 22: Remove the second item (index from JSON)
    await cartRows.nth(testCase.cartOperations.itemToRemove).locator('input[name="removefromcart"]').check();

    // Step 23: Update the cart
    await page.locator('input[name="updatecart"]').click();

    // Step 24: Verify that only one item is in the cart
    // Verification 5: Only 1 item remains in cart
    await expect(page.locator('.cart-item-row')).toHaveCount(1);

    // Postconditions (clean up cart, log out user)

    // Postcondition 1: Clean up cart (remove all items)
    await postcondition_cleanupCart(page);

    // Postcondition 2: Log out user
    await postcondition_logout(page);

    // Verification 6: User is logged out
    await expect(page.locator('.header-links a[href="/register"]')).toBeVisible();
});
