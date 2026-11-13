# Bug Report Template

**Title:** Short, specific summary (what fails, where)

**Environment**
- Device / emulator:
- Android version (API):
- App version / build:
- Network:

**Steps to reproduce**
1.
2.
3.

**Expected result:**

**Actual result:**

**Frequency:** Always / Often / Sometimes / Once

**Severity:** Critical / Major / Minor / Trivial
**Priority:** P1 / P2 / P3 / P4

**Evidence:** screenshot, screen recording, `adb logcat` stack trace

---

## Severity vs priority
- Severity is the technical impact (crash, data loss, cosmetic).
- Priority is how soon it must be fixed (business urgency).
- Example: a typo in the company name on the home screen is low severity but high priority.

## Example
**Title:** App crashes on rotation while the Wi-Fi list is loading
**Environment:** Pixel 7, Android 14 (API 34), build 2.3.1, Wi-Fi
**Steps:** 1. Open Wi-Fi screen. 2. While the list loads, rotate to landscape.
**Expected:** Screen redraws and keeps loading.
**Actual:** App closes. Log shows `java.lang.NullPointerException` in `WifiListFragment.onCreateView`.
**Frequency:** 5 of 5 attempts
**Severity:** Major, **Priority:** P2
**Evidence:** `rotation_crash.mp4`, `logcat_rotation.txt`
