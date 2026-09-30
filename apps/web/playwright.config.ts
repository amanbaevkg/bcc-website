import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.E2E_PORT ?? 3100);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['list'], ['junit', { outputFile: 'test-results/junit.xml' }]]
    : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'retain-on-failure',
    // Optional: use a preinstalled Chromium instead of Playwright's download.
    launchOptions: process.env.PW_CHROMIUM_PATH
      ? { executablePath: process.env.PW_CHROMIUM_PATH }
      : undefined,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: process.env.E2E_NO_SERVER
    ? undefined
    : {
        command: `pnpm start -p ${port}`,
        port,
        reuseExistingServer: !process.env.CI,
        // The test suite sends many enquiries; the production limit would block it.
        env: { SITE_ENV: 'staging', CONTACT_RATE_LIMIT: '1000' },
      },
});
