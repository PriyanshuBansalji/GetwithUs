import { expect, test } from "./support/test";

/*
 * The home hero at phone and desktop widths, in both themes. Captured under
 * reduced motion, which the design defines as a complete still frame (the
 * orbit holds its pose, the typewriter keeps its first word, marquees stop),
 * and Playwright disables CSS animations too, so the shot is stable.
 * Baselines are per platform; see docs/handoff.md for how CI produces the
 * Linux set.
 */
const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
];

for (const theme of ["light", "dark"] as const) {
  for (const viewport of VIEWPORTS) {
    test(`home hero at ${viewport.width} px, ${theme}`, async ({ page }) => {
      await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize(viewport);
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("canvas")).toHaveCount(0);
      await expect(page).toHaveScreenshot(`home-hero-${viewport.width}-${theme}.png`);
    });
  }
}
