import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for critical-flow smoke tests. Builds and starts the production server so the
 * tests exercise the same output users get. The dev env vars (local Postgres) are inherited from
 * the shell / .env.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
