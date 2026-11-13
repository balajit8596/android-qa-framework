import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

/**
 * Mobile-web suite: runs the same web app on emulated Android devices.
 * No phone or emulator is needed. Playwright applies each device's screen size,
 * pixel ratio, touch support and Android user agent.
 *
 * Locally everything is recorded (screenshots, video, trace) so you can show it.
 * On CI only failures are kept to save space.
 */
export default defineConfig({
  testDir: './tests/mobile-web',
  outputDir: './artifacts/playwright',
  timeout: 30_000,
  expect: { timeout: 7_000 },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'reports/playwright' }],
    ['junit', { outputFile: 'reports/junit/mobile-web.xml' }],
  ],
  use: {
    baseURL: process.env.WEB_BASE_URL ?? 'https://www.saucedemo.com',
    testIdAttribute: 'data-test',
    screenshot: isCI ? 'only-on-failure' : 'on',
    video: isCI ? 'retain-on-failure' : 'on',
    trace: isCI ? 'on-first-retry' : 'on',
  },
  projects: [
    { name: 'pixel-7', use: { ...devices['Pixel 7'] } },
    { name: 'galaxy-s9', use: { ...devices['Galaxy S9+'] } },
    { name: 'galaxy-tab-s4', use: { ...devices['Galaxy Tab S4'] } },
  ],
});
