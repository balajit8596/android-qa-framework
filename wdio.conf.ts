import type { Options } from '@wdio/types';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { env } from './src/config/env.ts';
import { Adb } from './src/utils/adb.ts';

const capability: Record<string, unknown> = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': env.deviceName,
  'appium:newCommandTimeout': 240,
  'appium:autoGrantPermissions': true,
  'appium:noReset': false,
};

if (env.serial) capability['appium:udid'] = env.serial;

if (env.appPath) {
  capability['appium:app'] = path.resolve(env.appPath);
} else {
  capability['appium:appPackage'] = env.appPackage;
  capability['appium:appActivity'] = env.appActivity;
}

export const config: Options.Testrunner = {
  runner: 'local',
  port: 4723,
  specs: ['./tests/device/**/*.spec.ts'],
  maxInstances: 1,
  capabilities: [capability as WebdriverIO.Capabilities],
  logLevel: 'warn',
  waitforTimeout: 10_000,
  connectionRetryTimeout: 120_000,
  connectionRetryCount: 2,

  services: [['appium', { args: { address: 'localhost', port: 4723 }, command: 'appium' }]],

  framework: 'mocha',
  mochaOpts: { ui: 'bdd', timeout: 120_000 },

  reporters: [
    'spec',
    ['junit', { outputDir: './reports/junit', outputFileFormat: () => 'results.xml' }],
  ],

  /**
   * On every failed test, capture evidence automatically:
   * a screenshot and the device log, ready to attach to a defect.
   */
  afterTest: async function (test, _context, { error }) {
    if (!error) return;
    const safeName = test.title.replace(/[^a-z0-9]+/gi, '_').slice(0, 60);
    const dir = path.join(env.artifactsDir, 'failures');
    await mkdir(dir, { recursive: true });
    try {
      await browser.saveScreenshot(path.join(dir, `${safeName}.png`));
    } catch {
      /* session may be gone; keep going */
    }
    try {
      await Adb.fromEnv().saveLogcat(path.join(dir, `${safeName}.logcat.txt`));
    } catch {
      /* adb unavailable */
    }
  },
};
