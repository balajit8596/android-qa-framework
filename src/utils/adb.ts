import { execFile } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { env } from '../config/env.ts';
import {
  parseBatteryLevel,
  parseDevices,
  parseGrantedPermissions,
  parseWifiEnabled,
  type AdbDevice,
} from './parsers.ts';

const execFileAsync = promisify(execFile);

export interface DeviceInfo {
  model: string;
  manufacturer: string;
  androidVersion: string;
  sdk: string;
}

/**
 * Typed wrapper around the adb command line.
 * Uses execFile (no shell), so arguments are never interpreted as shell code.
 */
export class Adb {
  private readonly serial?: string;
  private readonly bin: string;

  constructor(serial?: string, bin: string = process.env.ADB_PATH ?? 'adb') {
    this.serial = serial;
    this.bin = bin;
  }

  static fromEnv(): Adb {
    return new Adb(env.serial);
  }

  async run(args: string[], timeoutMs = 30_000): Promise<string> {
    const full = this.serial ? ['-s', this.serial, ...args] : args;
    const { stdout } = await execFileAsync(this.bin, full, {
      timeout: timeoutMs,
      maxBuffer: 100 * 1024 * 1024,
    });
    return stdout.trim();
  }

  shell(args: string[], timeoutMs?: number): Promise<string> {
    return this.run(['shell', ...args], timeoutMs);
  }

  // ---- devices ----------------------------------------------------------

  async devices(): Promise<AdbDevice[]> {
    return parseDevices(await this.run(['devices']));
  }

  async getProp(name: string): Promise<string> {
    return this.shell(['getprop', name]);
  }

  async deviceInfo(): Promise<DeviceInfo> {
    const [model, manufacturer, androidVersion, sdk] = await Promise.all([
      this.getProp('ro.product.model'),
      this.getProp('ro.product.manufacturer'),
      this.getProp('ro.build.version.release'),
      this.getProp('ro.build.version.sdk'),
    ]);
    return { model, manufacturer, androidVersion, sdk };
  }

  async batteryLevel(): Promise<number | undefined> {
    return parseBatteryLevel(await this.shell(['dumpsys', 'battery']));
  }

  // ---- apps -------------------------------------------------------------

  install(apkPath: string): Promise<string> {
    return this.run(['install', '-r', apkPath], 120_000);
  }

  uninstall(pkg: string): Promise<string> {
    return this.run(['uninstall', pkg]);
  }

  async isInstalled(pkg: string): Promise<boolean> {
    const out = await this.shell(['pm', 'list', 'packages', pkg]);
    return out.split(/\r?\n/).some((l) => l.trim() === `package:${pkg}`);
  }

  clearData(pkg: string): Promise<string> {
    return this.shell(['pm', 'clear', pkg]);
  }

  forceStop(pkg: string): Promise<string> {
    return this.shell(['am', 'force-stop', pkg]);
  }

  launch(pkg: string, activity: string): Promise<string> {
    return this.shell(['am', 'start', '-n', `${pkg}/${activity}`]);
  }

  async grantedPermissions(pkg: string): Promise<string[]> {
    return parseGrantedPermissions(await this.shell(['dumpsys', 'package', pkg]));
  }

  // ---- logs and evidence ------------------------------------------------

  clearLogcat(): Promise<string> {
    return this.run(['logcat', '-c']);
  }

  dumpLogcat(): Promise<string> {
    return this.run(['logcat', '-d'], 60_000);
  }

  async saveLogcat(filePath: string): Promise<string> {
    const log = await this.dumpLogcat();
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, log);
    return filePath;
  }

  // ---- network ----------------------------------------------------------

  async setWifi(enabled: boolean): Promise<void> {
    await this.shell(['svc', 'wifi', enabled ? 'enable' : 'disable']);
  }

  async isWifiEnabled(): Promise<boolean | undefined> {
    return parseWifiEnabled(await this.shell(['dumpsys', 'wifi']));
  }

  async setMobileData(enabled: boolean): Promise<void> {
    await this.shell(['svc', 'data', enabled ? 'enable' : 'disable']);
  }
}
