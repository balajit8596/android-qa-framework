/**
 * Pure functions that turn raw adb / dumpsys / logcat text into data.
 * Kept free of I/O so they are fast to unit test without a device.
 */

export interface AdbDevice {
  serial: string;
  state: string;
}

/** Parse the output of `adb devices`. */
export function parseDevices(output: string): AdbDevice[] {
  return output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('List of devices') && !line.startsWith('*'))
    .map((line) => {
      const [serial, state] = line.split(/\s+/);
      return { serial, state };
    });
}

/** Parse `adb shell dumpsys wifi` for the Wi-Fi on/off state. */
export function parseWifiEnabled(dumpsysWifi: string): boolean | undefined {
  const match = /Wi-?Fi is (enabled|disabled)/i.exec(dumpsysWifi);
  if (!match) return undefined;
  return match[1].toLowerCase() === 'enabled';
}

/** Parse `adb shell dumpsys battery` for the charge level (0-100). */
export function parseBatteryLevel(dumpsysBattery: string): number | undefined {
  const match = /level:\s*(\d+)/.exec(dumpsysBattery);
  return match ? Number(match[1]) : undefined;
}

/** Parse `adb shell dumpsys package <pkg>` for permissions that are granted. */
export function parseGrantedPermissions(dumpsysPackage: string): string[] {
  const granted = new Set<string>();
  const re = /([A-Za-z0-9_.]+):\s*granted=true/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(dumpsysPackage)) !== null) {
    granted.add(match[1]);
  }
  return [...granted].sort();
}

/**
 * Find crashes (FATAL EXCEPTION) and ANRs in a logcat dump.
 * When `pkg` is given, only blocks that mention that package are returned.
 */
export function parseCrashes(logcat: string, pkg?: string): string[] {
  const lines = logcat.split(/\r?\n/);
  const blocks: string[] = [];
  lines.forEach((line, i) => {
    if (line.includes('FATAL EXCEPTION')) {
      blocks.push(lines.slice(i, i + 4).join('\n'));
    } else if (/ANR in /.test(line)) {
      blocks.push(line);
    }
  });
  return pkg ? blocks.filter((b) => b.includes(pkg)) : blocks;
}

export const DEFAULT_SENSITIVE_PATTERNS: RegExp[] = [
  /password\s*[=:]\s*\S+/i,
  /passwd\s*[=:]\s*\S+/i,
  /api[_-]?key\s*[=:]\s*\S+/i,
  /authorization:\s*\S+/i,
  /bearer\s+[A-Za-z0-9\-._~+/]{10,}=*/i,
  /secret\s*[=:]\s*\S+/i,
];

export interface Leak {
  line: string;
  pattern: string;
}

/** Scan log text for credentials or tokens that should never be logged. */
export function findSensitiveLeaks(
  logText: string,
  patterns: RegExp[] = DEFAULT_SENSITIVE_PATTERNS,
): Leak[] {
  const leaks: Leak[] = [];
  for (const line of logText.split(/\r?\n/)) {
    for (const pattern of patterns) {
      if (pattern.test(line)) leaks.push({ line: line.trim(), pattern: String(pattern) });
    }
  }
  return leaks;
}
