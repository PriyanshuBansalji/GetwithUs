import { test as base, expect, type Page } from "@playwright/test";
import { closeDatabase, resetRateLimits } from "./db";

/** Browser messages the suite never accepts on a page: console errors, warnings, and uncaught exceptions. */
function watchConsole(page: Page): string[] {
  const problems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      problems.push(`${message.type()}: ${message.text()} (${page.url()})`);
    }
  });
  page.on("pageerror", (error) => problems.push(`uncaught: ${error.message} (${page.url()})`));
  return problems;
}

/**
 * The suite's `test`: every spec fails when the browser logged an error or a
 * warning, and rate-limit counters are cleared first so repeated form
 * submissions from 127.0.0.1 never hit the per-IP limits.
 */
export const test = base.extend<{ consoleProblems: string[] }, { database: void }>({
  database: [
    async ({}, use) => {
      await use();
      await closeDatabase();
    },
    { scope: "worker" },
  ],
  consoleProblems: [
    async ({ page, database }, use) => {
      void database;
      await resetRateLimits();
      const problems = watchConsole(page);
      await use(problems);
      expect(problems, "browser console errors or warnings").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
