# Test Case: TC-DWS-001

## 1. Test Case Definition Format & Key Attributes

| Attribute | Description |
|---------|-------------|
| **Test Case ID** | TC-DWS-001 |
| **Title** | Shopping cart management for Desktop computers with initial price ≤ 800 |
| **Description** | Verifies the end-to-end flow of user registration, discovery of low-priced desktop computers, and shopping cart CRUD operations after mandatory product configuration. |
| **Priority** | High |
| **Pre-conditions** | User is on the homepage; User is not currently logged in. |
| **Test Data** | Threshold Price (initial): ≤ 800.00<br>Item Names: *Build your own cheap computer*, *Desktop PC with CDRW*, *Simple Computer* |
| **Environment** | Dev |
| **Created By** | Nojus Sandovas |
| **Creation Date** | 2026-02-04 |
| **Expected Result** | Desktop computers with an initial price ≤ 800 are correctly identified, configured, added, updated, and removed from the shopping cart without errors. |

---

## 2. Test Case: TC-DWS-001

### Objective
To validate the full lifecycle of a shopping session focused on **desktop computers with an initial price ≤ 800**, including **Create (Registration/Add)**, **Read (Verify Cart)**, **Update (Quantity)**, and **Delete (Remove)** actions, while handling mandatory product configuration before adding items to the cart.

---

## 3. Test Steps

| Step # | Action Type | Logical Step Description |
|------:|------------|--------------------------|
| 1 | Navigation | Open the browser and navigate to https://demowebshop.tricentis.com/. |
| 2 | Navigation | Click on the **Register** link in the header. |
| 3 | CRUD (Create) | Enter registration details (Gender, First Name, Last Name, Email, Password, Confirm Password). |
| 4 | Action | Click the **Register** button to create a new user account. |
| 5 | Navigation | Click on the **Computers** menu item in the top horizontal bar. |
| 6 | Navigation | Select the **Desktops** sub-category from the menu or side panel. |
| 7 | CRUD (Read) | Sort the products by **Price: Low to High** using the dropdown. |
| 8 | CRUD (Read) | Identify desktop computers with an **initial price ≤ 800** (e.g., *Build your own cheap computer*). |
| 9 | Navigation | Click on the product title **Build your own cheap computer** to open the product details page. |
|10 | CRUD (Update) | Configure all **required product options** (e.g., Processor, RAM) before adding the item to the cart. |
|11 | Action | Click the **Add to cart** button. |
|12 | Navigation | Return to the **Desktops** category page. |
|13 | CRUD (Read) | Identify another desktop computer with an **initial price ≤ 800** (e.g., *Simple Computer* or *Desktop PC with CDRW*). |
|14 | Navigation | Click on the second product title to open the product details page. |
|15 | CRUD (Update) | Configure all **required product options** for the second item. |
|16 | Action | Click the **Add to cart** button. |
|17 | Navigation | Click the **Shopping cart** link at the top right of the page. |
|18 | CRUD (Read) | Verify the cart contains at least two items whose **initial prices** were ≤ 800. |
|19 | CRUD (Update) | Change the **Qty** for the first item from 1 to 2. |
|20 | Action | Click **Update shopping cart**. |
|21 | CRUD (Read) | Verify the **Sub-Total** updates correctly based on the new quantity. |
|22 | CRUD (Delete) | Select the **Remove** checkbox for the second item. |
|23 | Action | Click **Update shopping cart**. |
|24 | CRUD (Read) | Confirm the second item is no longer present in the cart. |
|25 | Navigation | Click **Log out** to end the session. |

---

## 4. Post-conditions
- User is logged out successfully.
- Shopping cart reflects the final validated state.
- All mandatory configuration and CRUD operations complete without errors.

---
