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
        // The admin starts on a throw-away database with test-only credentials.
        env: {
          SITE_ENV: 'staging',
          CONTACT_RATE_LIMIT: '1000',
          DATABASE_URL: 'file:./test-results/e2e.db',
          PAYLOAD_MEDIA_DIR: './test-results/media',
          PAYLOAD_SECRET: process.env.PAYLOAD_SECRET ?? 'e2e-only-secret-not-used-anywhere-else',
          PAYLOAD_ADMIN_EMAIL: 'e2e@example.com',
          PAYLOAD_ADMIN_PASSWORD: 'e2e-only-password',
        },
      },
});
