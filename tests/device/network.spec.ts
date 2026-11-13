import { driver, expect } from '@wdio/globals';
import { env } from '../../src/config/env.ts';
import { Adb } from '../../src/utils/adb.ts';
import { pollUntil } from '../../src/utils/wait.ts';

const adb = Adb.fromEnv();

describe('Network behaviour', () => {
  let wifiWasOn: boolean | undefined;

  before(async () => {
    wifiWasOn = await adb.isWifiEnabled();
  });

  after(async () => {
    // Always leave the device the way we found it.
    if (wifiWasOn !== false) await adb.setWifi(true);
  });

  it('TC-020 Wi-Fi can be switched off and the app stays alive', async () => {
    await adb.setWifi(false);
    await pollUntil(async () => (await adb.isWifiEnabled()) === false, {
      message: 'Wi-Fi did not switch off',
    });
    expect(await driver.getCurrentPackage()).toBe(env.appPackage);
  });

  it('TC-021 Wi-Fi can be switched back on', async () => {
    await adb.setWifi(true);
    await pollUntil(async () => (await adb.isWifiEnabled()) === true, {
      message: 'Wi-Fi did not switch on',
    });
    expect(await driver.getCurrentPackage()).toBe(env.appPackage);
  });

  it('TC-022 toggling mobile data does not crash the app', async () => {
    await adb.setMobileData(false);
    await adb.setMobileData(true);
    expect(await driver.getCurrentPackage()).toBe(env.appPackage);
  });
});
