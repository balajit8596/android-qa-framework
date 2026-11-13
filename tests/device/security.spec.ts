import { expect } from '@wdio/globals';
import { env } from '../../src/config/env.ts';
import { Adb } from '../../src/utils/adb.ts';
import { findSensitiveLeaks } from '../../src/utils/parsers.ts';

const adb = Adb.fromEnv();

describe('Security basics', () => {
  it('TC-030 app is not granted forbidden permissions', async () => {
    const granted = await adb.grantedPermissions(env.appPackage);
    console.log(`Granted permissions for ${env.appPackage}:`, granted.join(', ') || '(none)');
    const violations = granted.filter((p) => env.forbiddenPermissions.includes(p));
    expect(violations).toEqual([]);
  });

  it('TC-031 logs do not leak credentials or tokens', async () => {
    const log = await adb.dumpLogcat();
    const leaks = findSensitiveLeaks(log);
    expect(leaks).toEqual([]);
  });
});
