# Test Case: TC-DP-001

## 1. Test Case Definition Format & Key Attributes

| Attribute | Description |
|---------|-------------|
| **Test Case ID** | TC-DP-001 |
| **Title** | Dynamic Properties Widget Test |
| **Description** | Verifies that elements with dynamic properties correctly change their state over time |
| **Priority** | Low |
| **Pre-conditions** | User has access to the DemoQA website; Browser is open. |
| **Test Data** | N/A |
| **Environment** | Dev |
| **Created By** | Nojus Sandovas |
| **Creation Date** | 2026-03-03 |
| **Expected Result** | Buttons correctly transition from disabled to enabled, invisible to visible, and change color after the specified time. |

---

## 2. Test Case: TC-DP-001

### Objective
To verify that dynamic property elements on the page correctly change their state over time.

---

## 3. Test Steps

| Step # | Action Type | Logical Step Description |
|------:|------------|--------------------------|
| 1 | Navigation | Open the browser and navigate to https://demoqa.com/dynamic-properties. |
| 2 | Verification | **Verify** that the "Will enable 5 seconds" button is initially disabled. |
| 3 | Verification | **Verify** that the "Visible After 5 Seconds" button is initially not visible. |
| 4 | Synchronization | Wait for the "Will enable 5 seconds" button to become enabled using intelligent conditional waits. |
| 5 | Verification | **Verify** that the "Will enable 5 seconds" button is now enabled. |
| 6 | Synchronization | Wait for the "Visible After 5 Seconds" button to become visible. |
| 7 | Verification | **Verify** that the "Visible After 5 Seconds" button is now visible. |
| 8 | Verification | **Verify** that the "Color Change" button has changed its text color (has the 'text-danger' class). |

---
## 4. Post-conditions
- All dynamic property elements have transitioned to their final states
- Application remains stable and responsive
