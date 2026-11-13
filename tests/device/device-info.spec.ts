import { expect } from '@wdio/globals';
import { env } from '../../src/config/env.ts';
import { Adb } from '../../src/utils/adb.ts';

const adb = Adb.fromEnv();

describe('Device and adb checks', () => {
  it('TC-010 at least one device is connected and ready', async () => {
    const devices = await adb.devices();
    expect(devices.some((d) => d.state === 'device')).toBe(true);
  });

  it('TC-011 device reports Android version and model', async () => {
    const info = await adb.deviceInfo();
    console.log('Device under test:', JSON.stringify(info));
    expect(info.androidVersion).not.toBe('');
    expect(Number(info.sdk)).toBeGreaterThanOrEqual(21);
  });

  it('TC-012 app package is installed', async () => {
    expect(await adb.isInstalled(env.appPackage)).toBe(true);
  });

  it('TC-013 battery level is readable', async () => {
    const level = await adb.batteryLevel();
    expect(level).toBeGreaterThanOrEqual(0);
    expect(level).toBeLessThanOrEqual(100);
  });
});
