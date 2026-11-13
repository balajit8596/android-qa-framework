# Test Plan: Android App and Services

## 1. Objective
Verify that the Android application and its backend services are functional, stable, secure at a basic level, and behave correctly across supported devices, OS versions and network conditions.

## 2. Scope
**In scope**
- Functional behaviour of core user flows
- App lifecycle (launch, background, rotate, restore)
- Compatibility across the device and OS matrix
- Network behaviour (Wi-Fi, mobile data, offline, switching)
- Backend API checks (status codes, schema, errors, response time)
- Basic security checks (permissions, logging, storage, transport)

**Out of scope**
- Deep penetration testing
- Load and stress testing beyond basic response-time checks
- Third-party SDK internals

## 3. Test types
| Type | Approach |
|---|---|
| Smoke | Automated, run on every build |
| Functional | Manual plus automated |
| Regression | Automated suite, run before release |
| Compatibility | Device matrix below |
| Exploratory | Manual, time-boxed sessions |
| Network | adb-assisted (svc wifi/data), manual poor-network checks |
| Security (basic) | Permission audit, log-leak scan, checklist |
| API | Automated service tests |

## 4. Environments and device matrix
| Priority | Device | Android | Purpose |
|---|---|---|---|
| P1 | Latest flagship phone | Current release | Primary users |
| P1 | Popular mid-range phone | Current - 1 | Main user base |
| P2 | Older low-memory phone | Current - 3 | Performance and memory |
| P2 | Tablet | Current | Layout |
| P3 | Emulator (API 29 to latest) | Various | Breadth, quick checks |
| P3 | Emulated Pixel 7, Galaxy S9+, Galaxy Tab S4 (browser) | Android Chrome profile | Mobile web: layout, touch, network, basic security. Runs anywhere, no hardware |

The matrix should be updated from real usage analytics.

## 5. Entry criteria
- Build delivered with release notes
- Smoke test passes on the build
- Test devices and accounts are ready

## 6. Exit criteria
- 100% of critical test cases executed, 95% pass rate overall
- No open Critical or Major defects
- All failed tests have a logged defect
- Regression suite passes

## 7. Test cycle
1. Review requirements and update test cases
2. Receive build, run smoke test
3. Execute planned cases (manual and automated)
4. Log defects with evidence (screenshot, video, logcat)
5. Verify fixes and run regression
6. Report status against exit criteria

## 8. Defect management
Defects are tracked in the issue tracker (JIRA or GitHub Issues). Use the template in `docs/BUG_REPORT_TEMPLATE.md`.
Workflow: New, Assigned, In Progress, Fixed, Retest, Closed (or Reopened).

## 9. Risks and mitigation
| Risk | Mitigation |
|---|---|
| OEM-specific behaviour | Include devices from the main manufacturers |
| Flaky UI automation | Stable locators, explicit waits, isolated state |
| Late builds | Prioritise by risk, smoke first |
| Limited device availability | Emulators for breadth, real devices for critical flows |

## 10. Deliverables
Test plan, test cases, execution report, defect reports, automation results (JUnit XML) and failure evidence.
