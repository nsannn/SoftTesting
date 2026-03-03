# Test Case: TC-PB-001

## 1. Test Case Definition Format & Key Attributes

| Attribute | Description |
|---------|-------------|
| **Test Case ID** | TC-PB-001 |
| **Title** | Progress Bar Widget Synchronization Test |
| **Description** | Verifies the Progress Bar widget functionality and synchronization. |
| **Priority** | Low |
| **Pre-conditions** | User has access to the DemoQA website; Browser is open. |
| **Test Data** | N/A |
| **Environment** | Dev |
| **Created By** | Nojus Sandovas |
| **Creation Date** | 2026-03-03 |
| **Expected Result** | Progress bar starts at 0%, completes to 100%, button changes to Reset, and successfully resets back to 0%. |

---

## 2. Test Case: TC-PB-001

### Objective
To validate the Progress Bar widget synchronization by testing out startt/stop functionality, progress completion to 100%, button state changes, and reset.

---

## 3. Test Steps

| Step # | Action Type | Logical Step Description |
|------:|------------|--------------------------|
| 1 | Navigation | Open the browser and navigate to https://demoqa.com/progress-bar. |
| 2 | Verification | **Verify** that the progress bar is initially at 0%. |
| 3 | Verification | **Verify** that the Start button is visible and enabled. |
| 4 | Action | Click the **Start** button to begin the progress. |
| 5 | Synchronization | Wait for the progress bar to reach 100% using intelligent conditional waits. |
| 6 | Verification | **Verify** that the progress bar displays 100%. |
| 7 | Verification | **Verify** that the button text has changed to "Reset". |
| 8 | Action | Click the **Reset** button. |
| 9 | Verification | **Verify** that the progress bar has reset to 0%. |
| 10 | Verification | **Verify** that the button text has changed back to "Start". |

---

## 4. Post-conditions
- Progress back to 0%
- Button text displays "Start"
- Application is stable and responsive