import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "./support/test";

const PAGES = [
  "/",
  "/services",
  "/services/web-development",
  "/services/agentic-automation/whatsapp-bot",
  "/process",
  "/about",
  "/contact",
  "/start",
  "/privacy",
  "/admin/login",
];

/*
 * Purely decorative pieces (the stack sphere's chips fade with depth) are
 * marked data-decorative and hidden from assistive technology; WCAG 1.4.3
 * exempts text that is pure decoration, so axe leaves them out. Every name
 * they show is also in the page as real text.
 */
for (const theme of ["light", "dark"] as const) {
  for (const path of PAGES) {
    test(`axe finds no WCAG 2.2 AA violations on ${path} (${theme})`, async ({ page }) => {
      await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.waitForLoadState("networkidle");
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .exclude("[data-decorative]")
        .analyze();
      const summary = results.violations.map((violation) => ({
        rule: violation.id,
        impact: violation.impact,
        targets: violation.nodes.map((node) => node.target.join(" ")),
      }));
      expect(summary).toEqual([]);
    });
  }
}
