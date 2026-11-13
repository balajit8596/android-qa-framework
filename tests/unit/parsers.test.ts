import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  findSensitiveLeaks,
  parseBatteryLevel,
  parseCrashes,
  parseDevices,
  parseGrantedPermissions,
  parseWifiEnabled,
} from '../../src/utils/parsers.ts';

describe('parseDevices', () => {
  it('parses connected devices and ignores the header and daemon lines', () => {
    const out = [
      '* daemon not running; starting now at tcp:5037',
      '* daemon started successfully',
      'List of devices attached',
      'emulator-5554\tdevice',
      'R58M123ABC\tunauthorized',
      '',
    ].join('\n');
    assert.deepEqual(parseDevices(out), [
      { serial: 'emulator-5554', state: 'device' },
      { serial: 'R58M123ABC', state: 'unauthorized' },
    ]);
  });

  it('returns an empty list when nothing is attached', () => {
    assert.deepEqual(parseDevices('List of devices attached\n\n'), []);
  });
});

describe('parseWifiEnabled', () => {
  it('detects enabled and disabled', () => {
    assert.equal(parseWifiEnabled('Wi-Fi is enabled\nother'), true);
    assert.equal(parseWifiEnabled('Wi-Fi is disabled'), false);
  });

  it('returns undefined when the state is not present', () => {
    assert.equal(parseWifiEnabled('nothing useful'), undefined);
  });
});

describe('parseBatteryLevel', () => {
  it('reads the level', () => {
    assert.equal(parseBatteryLevel('Current Battery Service state:\n  level: 87\n  scale: 100'), 87);
  });
});

describe('parseGrantedPermissions', () => {
  it('returns only granted permissions, de-duplicated and sorted', () => {
    const dump = [
      'runtime permissions:',
      '  android.permission.CAMERA: granted=true, flags=[ USER_SET]',
      '  android.permission.READ_SMS: granted=false, flags=[ ]',
      '  android.permission.ACCESS_FINE_LOCATION: granted=true',
      '  android.permission.CAMERA: granted=true',
    ].join('\n');
    assert.deepEqual(parseGrantedPermissions(dump), [
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.CAMERA',
    ]);
  });
});

describe('parseCrashes', () => {
  const log = [
    '11-13 09:00:00.000 E/AndroidRuntime( 1234): FATAL EXCEPTION: main',
    '11-13 09:00:00.001 E/AndroidRuntime( 1234): Process: com.example.app, PID: 1234',
    '11-13 09:00:00.002 E/AndroidRuntime( 1234): java.lang.NullPointerException',
    '11-13 09:01:00.000 E/ActivityManager( 500): ANR in com.other.app',
  ].join('\n');

  it('finds all crashes and ANRs', () => {
    assert.equal(parseCrashes(log).length, 2);
  });

  it('filters by package', () => {
    const result = parseCrashes(log, 'com.example.app');
    assert.equal(result.length, 1);
    assert.match(result[0], /NullPointerException/);
  });

  it('returns nothing for a clean log', () => {
    assert.deepEqual(parseCrashes('I/ActivityManager: all good'), []);
  });
});

describe('findSensitiveLeaks', () => {
  it('flags credentials and tokens in logs', () => {
    const log = [
      'D/Login: user=alice password=hunter2',
      'D/Http: Authorization: Bearer abcdefghijklmnop12345',
      'D/Other: harmless message',
    ].join('\n');
    const leaks = findSensitiveLeaks(log);
    assert.ok(leaks.length >= 2);
    assert.ok(leaks.every((l) => !l.line.includes('harmless')));
  });

  it('returns nothing for a clean log', () => {
    assert.deepEqual(findSensitiveLeaks('I/App: started\nD/Net: GET /posts 200'), []);
  });
});
