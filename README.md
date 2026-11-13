# Android QA Automation Framework

A framework for testing Android apps and the services behind them. It combines **Appium (UiAutomator2) automation**, an **adb tooling layer**, **security and network checks**, **API tests**, and the **QA documentation** (test plan, test cases, bug template) that a real test cycle needs.

By default it tests the stock Android **Settings** app, so it runs on any emulator with no APK. Point it at your own app by setting `APP_PACKAGE`/`APP_ACTIVITY`, or `APP_PATH` to an APK.

## How it maps to the job requirements

| Requirement | Where it lives |
|---|---|
| Android testing (apps, phones) | `tests/device/`, `docs/TEST_CASES.md`, device matrix in `docs/TEST_PLAN.md` |
| Automation | Appium + WebdriverIO + TypeScript, screen objects in `src/screens/` |
| Automation with AI | See "Using AI responsibly" below |
| Security testing basics | `tests/device/security.spec.ts`, `docs/SECURITY_AND_NETWORK_CHECKLIST.md` |
| Networking basics | `tests/device/network.spec.ts`, `tests/api/posts.test.ts`, checklist |
| Defect tracking and reporting | `docs/BUG_REPORT_TEMPLATE.md`, `.github/ISSUE_TEMPLATE/`, auto-captured failure evidence |
| Test plan and test cycle | `docs/TEST_PLAN.md` (scope, matrix, entry/exit criteria, cycle) |
| Linux environment | `scripts/*.sh` (environment check, evidence collection, smoke run) |
| adb commands | `src/utils/adb.ts`, `docs/ADB_CHEATSHEET.md` |
| Web and mobile applications | Mobile via Appium, web services via API tests |

## Architecture

```
tests/
  device/        Appium tests (smoke, device-info, network, security)
  api/           backend service tests (Node test runner)
  unit/          fast parser tests, no device needed
src/
  config/env.ts      typed configuration from .env
  screens/           screen objects (BaseScreen, SettingsScreen)
  utils/adb.ts       typed adb wrapper (execFile, no shell injection)
  utils/parsers.ts   pure parsers for devices, dumpsys, logcat, leaks
  utils/wait.ts      pollUntil helper (no fixed sleeps)
wdio.conf.ts         capabilities, reporters, failure-evidence hook
scripts/             Linux helper scripts
docs/                test plan, test cases, checklists, templates
```

Design points worth knowing:
- **Screen objects** keep locators in one place, so tests read as intent.
- **Evidence on failure**: `wdio.conf.ts` saves a screenshot and the logcat for every failed test into `artifacts/failures/`, ready to attach to a defect.
- **adb layer** covers install, permissions, logs, battery, and Wi-Fi/mobile-data toggling, so tests can create conditions the UI cannot.
- **Parsers are pure functions** with unit tests, so most logic is verified without a device.
- **Configurable** through `.env`, so the same tests run on any device or app.

## Prerequisites
- Node.js 22+
- Java 17
- Android SDK platform-tools (`adb` on PATH) and `ANDROID_HOME` set
- An emulator or a phone with USB debugging enabled

## Getting started

```bash
npm install
npm run setup:appium          # installs the UiAutomator2 driver
cp .env.example .env          # optional

npm run doctor                # check the environment (Linux/macOS/Git Bash/WSL)
npm run test:unit             # no device needed
npm run test:api              # no device needed
npm run test:smoke            # device smoke tests (@smoke)
npm run test:device           # all device tests
npm run test:security
npm run test:network
```

Collect evidence from a connected device:
```bash
bash scripts/collect_logs.sh com.android.settings
```

Results: console output, `reports/junit/results.xml`, and failure evidence in `artifacts/`.

## Using AI responsibly
AI assistants are useful for drafting test cases from requirements, generating test data, explaining stack traces, and suggesting locators or boilerplate. This repo keeps a human in the loop: generated tests are reviewed, run, and checked against requirements, expected results are never taken from AI output alone, and no confidential data goes into unapproved tools.

## CI
GitHub Actions runs type checking, unit tests and API tests on every push. A manual `workflow_dispatch` run also boots an Android emulator and runs the device suite, uploading reports and evidence.

## Notes on locators
Settings labels vary by Android version and manufacturer. If a UI test cannot find an item, adjust the label in `tests/device/smoke.spec.ts` or `src/screens/SettingsScreen.ts`.

## Roadmap
Real app APK support with page flows, visual comparison, Allure reporting, parallel device runs, and BrowserStack or device-farm execution.
