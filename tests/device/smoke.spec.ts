import { driver, expect } from '@wdio/globals';
import { env } from '../../src/config/env.ts';
import { SettingsScreen } from '../../src/screens/SettingsScreen.ts';
import { Adb } from '../../src/utils/adb.ts';
import { parseCrashes } from '../../src/utils/parsers.ts';

const adb = Adb.fromEnv();
const settings = new SettingsScreen();

describe('Smoke @smoke', () => {
  before(async () => {
    await adb.clearLogcat();
  });

  it('TC-001 app launches in the foreground @smoke', async () => {
    expect(await driver.getCurrentPackage()).toBe(env.appPackage);
  });

  it('TC-002 main screen shows content @smoke', async () => {
    const source = await settings.pageSource();
    expect(source.length).toBeGreaterThan(500);
  });

  it('TC-003 can navigate into a screen and back @smoke', async () => {
    await settings.openItem('Battery');
    expect(await settings.pageSource()).toContain('Battery');
    await settings.back();
    expect(await driver.getCurrentPackage()).toBe(env.appPackage);
  });

  it('TC-004 app survives being sent to background and restored', async () => {
    await driver.execute('mobile: backgroundApp', { seconds: 3 });
    expect(await driver.getCurrentPackage()).toBe(env.appPackage);
  });

  it('TC-005 app survives rotation', async () => {
    await driver.setOrientation('LANDSCAPE');
    expect(await driver.getOrientation()).toBe('LANDSCAPE');
    await driver.setOrientation('PORTRAIT');
    expect(await driver.getCurrentPackage()).toBe(env.appPackage);
  });

  it('TC-006 no crash or ANR was logged during the run @smoke', async () => {
    const crashes = parseCrashes(await adb.dumpLogcat(), env.appPackage);
    expect(crashes).toEqual([]);
  });
});
