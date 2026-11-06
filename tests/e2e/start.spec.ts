import { leadsByEmail } from "./support/db";
import { expect, test } from "./support/test";

const DESCRIPTION = "A booking app for a small chain of clinics in two cities.";

test("the project brief validates each step, keeps the draft, and reaches the code step", async ({
  page,
}) => {
  const email = `e2e.brief.${Date.now()}@example.com`;
  await page.goto("/start");
  const proceed = page.getByRole("button", { name: "Continue" });

  // Step 1: Continue waits for at least one service.
  await expect(proceed).toBeDisabled();
  await page.locator("label", { has: page.locator("input[value=app-development]") }).click();
  await page.locator("label", { has: page.locator("input[value=whatsapp-bot]") }).click();
  await expect(proceed).toBeEnabled();
  await proceed.click();

  // Step 2: too short a description is held back.
  const description = page.getByLabel(/Describe what you want built/);
  await description.fill("An app.");
  await expect(proceed).toBeDisabled();
  await description.fill(DESCRIPTION);
  await page.getByLabel(/Existing website/).fill("example.com");

  // A refresh keeps the draft (sessionStorage); Back keeps earlier answers.
  await page.reload();
  await expect(page.getByLabel(/Describe what you want built/)).toHaveValue(DESCRIPTION);
  await page.getByRole("button", { name: "Back" }).click();
  await expect(page.locator("input[value=whatsapp-bot]")).toBeChecked();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  // Step 3: budget and timeline.
  await page.getByText("Not sure yet").click();
  await page.getByText("Exploring").click();
  await page.getByRole("button", { name: "Continue" }).click();

  // Step 4: details, then submit.
  await page.getByLabel("Name").fill("Test Lead Two");
  await page.getByLabel("Work email").fill(email);
  await page.waitForTimeout(3_200);
  await page.getByRole("button", { name: "Send and verify" }).click();

  await expect(page.getByRole("heading", { name: "Check your email" })).toBeVisible();
  const leads = await leadsByEmail(email);
  expect(leads).toHaveLength(1);
  expect(leads[0]).toMatchObject({ status: "pending_verification", source: "brief" });
});
