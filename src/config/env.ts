import 'dotenv/config';

const list = (value: string | undefined, fallback: string[]): string[] =>
  value ? value.split(',').map((s) => s.trim()).filter(Boolean) : fallback;

/** Central, typed configuration. Every value can be overridden from .env or the shell. */
export const env = {
  appPackage: process.env.APP_PACKAGE ?? 'com.android.settings',
  appActivity: process.env.APP_ACTIVITY ?? '.Settings',
  appPath: process.env.APP_PATH,
  deviceName: process.env.DEVICE_NAME ?? 'Android Emulator',
  serial: process.env.ANDROID_SERIAL,
  apiBaseUrl: process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com',
  artifactsDir: process.env.ARTIFACTS_DIR ?? 'artifacts',
  forbiddenPermissions: list(process.env.FORBIDDEN_PERMISSIONS, [
    'android.permission.READ_SMS',
    'android.permission.SEND_SMS',
    'android.permission.READ_CALL_LOG',
    'android.permission.RECORD_AUDIO',
  ]),
};
