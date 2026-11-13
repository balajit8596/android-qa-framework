# Android QA Automation Framework

A framework for testing Android apps and the services behind them. It has three layers of automation plus the QA documentation a real test cycle needs:

1. **Mobile web on emulated Android devices** (Playwright): Pixel 7, Galaxy S9+ and Galaxy Tab S4 profiles. Runs anywhere, no phone needed.
2. **Native Android apps** (Appium + UiAutomator2) with an **adb tooling layer**: needs an emulator or device.
3. **Backend services** (API tests) and **unit tests** for the adb/log parsers: run anywhere.

## How it maps to the job requirements

| Requirement | Where it lives |
|---|---|
| Android testing (apps, phones) | `tests/device/` (native, Appium), `tests/mobile-web/device-compat.spec.ts` (Android device profiles), device matrix in `docs/TEST_PLAN.md` |
| Automation | Playwright (mobile web) and Appium/WebdriverIO (native), both in TypeScript with page and screen objects |
| Automation with AI | See "Using AI responsibly" below |
| Security testing basics | `tests/mobile-web/security.spec.ts`, `tests/device/security.spec.ts`, `docs/SECURITY_AND_NETWORK_CHECKLIST.md` |
| Networking basics | `tests/mobile-web/network.spec.ts` (offline, slow 3G, blocked requests), `tests/device/network.spec.ts` (Wi-Fi/data via adb), `tests/api/` |
| Defect tracking and reporting | `docs/BUG_REPORT_TEMPLATE.md`, `.github/ISSUE_TEMPLATE/`, automatic defect evidence (screenshot, video, trace, console and network log) |
| Test plan and test cycle | `docs/TEST_PLAN.md` (scope, matrix, entry/exit criteria, cycle), `docs/TEST_CASES.md` (IDs mapped to specs) |
| Linux environment | `scripts/*.sh` (environment check, evidence collection, smoke run, mobile-web run) |
| adb commands | `src/utils/adb.ts`, `docs/ADB_CHEATSHEET.md` |
| Web and mobile applications | Web on emulated Android devices (Playwright), native mobile (Appium), services (API tests) |

## What runs where

| Suite | Command | Needs a device? |
|---|---|---|
| Parser unit tests | `npm run test:unit` | No |
| API tests | `npm run test:api` | No |
| **Mobile web on emulated Android devices** | `npm run test:mobile-web` | **No** |
| Native Android (Appium) | `npm run test:smoke`, `test:device`, `test:security`, `test:network` | Yes (emulator or phone) |

## Architecture

```
tests/
  mobile-web/    Playwright specs on emulated Android devices
                   device-compat.spec.ts, network.spec.ts, security.spec.ts
  device/        Appium specs for native apps (smoke, device-info, network, security)
  api/           backend service tests (Node test runner)
  unit/          fast parser tests
src/
  web/           fixtures (defect evidence) and page objects for mobile web
  screens/       screen objects for native Android
  utils/adb.ts   typed adb wrapper (execFile, no shell injection)
  utils/parsers.ts   pure parsers for devices, dumpsys, logcat, credential leaks
  utils/wait.ts  pollUntil helper (no fixed sleeps)
  config/env.ts  typed configuration from .env
playwright.config.ts   device profiles, reporters, recording
wdio.conf.ts           Appium capabilities, failure-evidence hook
scripts/               Linux helper scripts
docs/                  test plan, test cases, checklists, templates
```

Design points worth knowing:
- **One test, many devices.** Each Playwright spec runs once per project (Pixel 7, Galaxy S9+, Galaxy Tab S4), giving compatibility coverage across phone and tablet profiles for free.
- **Defect evidence on failure.** An auto fixture records console errors, failed requests and plain-HTTP requests, and attaches them to the report next to the screenshot, video and trace.
- **Native tests use screen objects** and an **adb layer** that can create conditions the UI cannot (toggle Wi-Fi, read permissions, dump logs).
- **Parsers are pure functions** with unit tests, so most logic is verified without a device.
- **Configurable** via `.env`, so the same suites run against other apps and environments.

## Prerequisites
- Node.js 22+
- For mobile web: nothing else
- For native Android: Java 17, Android SDK platform-tools (`adb` on PATH), `ANDROID_HOME` set, and an emulator or phone with USB debugging

## Getting started

```bash
npm install
npm run setup:browsers        # downloads Chromium for Playwright
cp .env.example .env          # optional

npm run test:unit
npm run test:api
npm run test:mobile-web       # all three emulated devices
npm run test:mobile-web:pixel # just Pixel 7
npm run report:mobile-web     # open the HTML report
```

Locally the mobile-web run records screenshots, video and traces for every test (see `artifacts/playwright/` and the HTML report in `reports/`). On CI only failures are kept.

Native Android (needs a device or emulator):
```bash
npm run setup:appium
npm run doctor                # environment check (Linux/macOS/Git Bash/WSL)
npm run test:smoke
npm run test:device
bash scripts/collect_logs.sh com.android.settings   # gather evidence
```

## Using AI responsibly
AI assistants are useful for drafting test cases from requirements, generating test data, explaining stack traces, and suggesting locators or boilerplate. This repo keeps a human in the loop: generated tests are reviewed, run, and checked against requirements, expected results are never taken from AI output alone, and no confidential data goes into unapproved tools.

## CI
GitHub Actions runs type checking, unit tests and API tests, and the mobile-web suite on every push, uploading the report and evidence. A manual `workflow_dispatch` run also boots an Android emulator and runs the native device suite.

## Limits to be aware of
- Mobile-web emulation applies Android screen, touch and user-agent profiles in desktop Chrome. It does not exercise the real Android OS, Chrome for Android, adb or device hardware. That is what the native Appium suite and real devices are for.
- Settings labels in the native suite vary by Android version and manufacturer, so adjust them in `src/screens/SettingsScreen.ts` if needed.
- The test target (SauceDemo) is a public demo site and can change.

## Roadmap
Real app APK support, visual comparison, Allure reporting, parallel device runs, and BrowserStack or another device cloud for real-device coverage.
