import { defineConfig, devices } from "@playwright/test";
import { baseUrl, serverCommand, serverEnv } from "./tests/e2e/support/env";

const ci = Boolean(process.env.CI);

/**
 * End-to-end suite: a production build with test hooks, the console email
 * transport, and a dedicated database (see tests/e2e/support/env.ts).
 * Specs share one database, so they run one at a time.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/support/global-setup.ts",
  fullyParallel: false,
  workers: 1,
  forbidOnly: ci,
  retries: ci ? 1 : 0,
  reporter: ci ? [["github"], ["html", { open: "never" }]] : [["list"]],
  timeout: 60_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: { animations: "disabled", caret: "hide", maxDiffPixelRatio: 0.01 },
  },
  use: {
    baseURL: baseUrl,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // WebGL through ANGLE on SwiftShader, the same on every OS and on CI runners
        // without a GPU. The default headless path composites WebGL by reading pixels
        // back, which logs a "GPU stall due to ReadPixels" driver warning that real
        // browsers with GPU compositing never show.
        launchOptions: { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] },
      },
    },
  ],
  webServer: {
    command: serverCommand,
    url: `${baseUrl}/api/v1/health`,
    env: serverEnv,
    timeout: 600_000,
    reuseExistingServer: false,
    stdout: "ignore",
    stderr: "pipe",
  },
});
