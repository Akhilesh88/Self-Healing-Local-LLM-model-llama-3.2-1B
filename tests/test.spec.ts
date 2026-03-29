// =============================
// FILE: test.spec.js
// =============================

import { test, expect } from "@playwright/test";
import { safeClick } from "../healer.js";

test("self healing login", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/v1/");

  await page.fill("#user-name", "standard_user");

  // Intentional failure
  await safeClick(page, "", "password field");

  await page.fill("#password", "secret_sauce");
  await safeClick(page, "#login-button", "login button");

  await expect(page).toHaveURL(/inventory/);
});