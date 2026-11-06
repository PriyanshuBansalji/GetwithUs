import type { Page } from "@playwright/test";
import { leadsByEmail } from "./support/db";
import { expect, test } from "./support/test";

/** The server rejects submissions made less than 3 seconds after the form token was issued. */
const TOKEN_MIN_AGE_MS = 3_200;

async function fillContact(page: Page, email: string) {
  await page.getByLabel("Name").fill("Test Lead");
  await page.getByLabel("Work email").fill(email);
  await page.locator("label", { has: page.locator("input[value=web-development]") }).click();
  await page.getByLabel("Message").fill("We need a new marketing site that our team can edit.");
}

test.describe("contact form", () => {
  test("shows a message next to each invalid field", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send and verify" }).click();
    await expect(page.getByText("Enter your name.")).toBeVisible();
    await expect(page.getByText(/Enter a valid email address/)).toBeVisible();
    await expect(page.getByText(/Write at least 20 characters/)).toBeVisible();
    await expect(page.getByLabel("Name")).toHaveAttribute("aria-invalid", "true");
  });

  test("a valid submission reaches the code step and stores a pending lead", async ({ page }) => {
    const email = `e2e.contact.${Date.now()}@example.com`;
    await page.goto("/contact");
    await fillContact(page, email);
    await page.waitForTimeout(TOKEN_MIN_AGE_MS);
    await page.getByRole("button", { name: "Send and verify" }).click();

    await expect(page.getByRole("heading", { name: "Check your email" })).toBeVisible();
    await expect(page.getByText(`We sent a 6-digit code to ${email}`)).toBeVisible();
    const leads = await leadsByEmail(email);
    expect(leads).toHaveLength(1);
    expect(leads[0]).toMatchObject({ status: "pending_verification", source: "contact" });
  });

  test("a honeypot submission looks successful but stores nothing", async ({ page }) => {
    const email = `e2e.bot.${Date.now()}@example.com`;
    await page.goto("/contact");
    await fillContact(page, email);
    await page.locator("#website").fill("http://spam.example", { force: true });
    await page.waitForTimeout(TOKEN_MIN_AGE_MS);
    await page.getByRole("button", { name: "Send and verify" }).click();

    await expect(page.getByRole("heading", { name: "Check your email" })).toBeVisible();
    expect(await leadsByEmail(email)).toHaveLength(0);
  });
});
