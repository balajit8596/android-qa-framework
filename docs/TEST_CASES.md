# Test Cases

Automation coverage is mapped to the spec that implements each case. Cases marked Manual are intended for exploratory or hardware-dependent testing.

| ID | Area | Title | Expected result | Type | Automated in |
|---|---|---|---|---|---|
| TC-001 | Launch | App launches in the foreground | App package is in the foreground | Smoke | `smoke.spec.ts` |
| TC-002 | UI | Main screen renders content | Screen has content | Smoke | `smoke.spec.ts` |
| TC-003 | Navigation | Open a sub-screen and go back | Correct screen shown, app stays open | Smoke | `smoke.spec.ts` |
| TC-004 | Lifecycle | Background for 3 seconds then restore | App resumes without crash | Functional | `smoke.spec.ts` |
| TC-005 | Lifecycle | Rotate portrait and landscape | State preserved, no crash | Functional | `smoke.spec.ts` |
| TC-006 | Stability | No crash or ANR in log | No FATAL EXCEPTION or ANR for the package | Smoke | `smoke.spec.ts` |
| TC-010 | Device | Device is connected and ready | `adb devices` shows state `device` | Env | `device-info.spec.ts` |
| TC-011 | Device | Device reports Android version and model | Properties readable | Env | `device-info.spec.ts` |
| TC-012 | Install | App package is installed | Package listed | Env | `device-info.spec.ts` |
| TC-013 | Device | Battery level readable | Level 0 to 100 | Env | `device-info.spec.ts` |
| TC-020 | Network | Turn Wi-Fi off | App stays alive, Wi-Fi reported off | Functional | `network.spec.ts` |
| TC-021 | Network | Turn Wi-Fi back on | Wi-Fi reported on, app alive | Functional | `network.spec.ts` |
| TC-022 | Network | Toggle mobile data | No crash | Functional | `network.spec.ts` |
| TC-030 | Security | Permission audit | No forbidden permissions granted | Security | `security.spec.ts` |
| TC-031 | Security | Log leak scan | No credentials or tokens in logcat | Security | `security.spec.ts` |
| TC-040 | API | GET list | 200, JSON, non-empty | API | `posts.test.ts` |
| TC-041 | API | GET single resource | Schema matches | API | `posts.test.ts` |
| TC-042 | API | POST create | 201 and body echoed | API | `posts.test.ts` |
| TC-043 | API | Unknown resource | 404 | API | `posts.test.ts` |
| TC-044 | API | Response time | Under 2 seconds | API | `posts.test.ts` |
| TC-060 | Compatibility | Emulated device reports Android and touch | UA contains Android, touch points > 0 | Smoke | `device-compat.spec.ts` |
| TC-061 | Compatibility | Login and product list render per device | Products page loads with items | Smoke | `device-compat.spec.ts` |
| TC-062 | Touch | Tap Add to cart | Cart badge shows 1 | Smoke | `device-compat.spec.ts` |
| TC-063 | Orientation | Rotate the device | Layout still usable in both orientations | Functional | `device-compat.spec.ts` |
| TC-064 | Network | Go offline, then back online | Load fails offline, recovers online | Functional | `mobile-web/network.spec.ts` |
| TC-065 | Network | Slow 3G connection | Login page loads, load time recorded | Functional | `mobile-web/network.spec.ts` |
| TC-066 | Network | Image requests blocked | App still works | Functional | `mobile-web/network.spec.ts` |
| TC-067 | Security | HTTPS only | URL starts with https | Security | `mobile-web/security.spec.ts` |
| TC-068 | Security | Password field masked | Input type is password | Security | `mobile-web/security.spec.ts` |
| TC-069 | Security | No credentials in URL | URL has no username or password | Security | `mobile-web/security.spec.ts` |
| TC-070 | Security | No mixed content | No plain-HTTP requests | Security | `mobile-web/security.spec.ts` |
| TC-071 | Security | Script injection in input | No script runs, error shown | Security | `mobile-web/security.spec.ts` |
| TC-072 | Security | Security response headers | Missing headers reported (informational) | Security | `mobile-web/security.spec.ts` |
| TC-050 | Install | Fresh install and first launch | No crash, onboarding shown | Manual | none |
| TC-051 | Upgrade | Upgrade from previous version | Data and settings preserved | Manual | none |
| TC-052 | Interrupt | Incoming call during use | App pauses and resumes correctly | Manual | none |
| TC-053 | Interrupt | Low battery and battery saver mode | App still works | Manual | none |
| TC-054 | Permissions | Deny, allow, and "don't ask again" | Graceful handling, clear message | Manual | none |
| TC-055 | Network | Poor connection (throttled, packet loss) | Timeouts and retries handled, clear error | Manual | none |
| TC-056 | Compatibility | Run on P1 and P2 devices | Consistent behaviour and layout | Manual | none |
