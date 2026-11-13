# Security and Network Checklist (QA level)

## Basic security
- [ ] App requests only the permissions it needs (`adb shell dumpsys package <pkg>`)
- [ ] Denying a permission leads to a clear message, not a crash
- [ ] No passwords, tokens or personal data in `adb logcat` (automated: TC-031)
- [ ] Sensitive data not stored in plain text (app data, shared prefs, `/sdcard`)
- [ ] All traffic uses HTTPS, no cleartext HTTP
- [ ] Invalid or expired certificates are rejected
- [ ] Session expires after inactivity, logout invalidates the session
- [ ] Sensitive screens hidden from the recents screen and screenshots where required
- [ ] Input fields reject script and injection strings (for example `<script>`, `' OR 1=1`)
- [ ] Deep links and exported components do not expose protected screens
- [ ] Behaviour checked on a rooted or modified device if required
- [ ] Release build is not debuggable and not flagged for backup if sensitive

Automated for the web app on emulated Android devices: HTTPS (TC-067), masked password (TC-068), no credentials in the URL (TC-069), no mixed content (TC-070), script injection (TC-071), response headers (TC-072).

Reference: OWASP Mobile Top 10. Useful tools: Burp Suite or OWASP ZAP (traffic), MobSF (static APK analysis).

## Networking
- [ ] Works on Wi-Fi, mobile data and after switching between them
- [ ] Offline mode shows a clear message, and data syncs after reconnect
- [ ] Airplane mode on and off during an active request
- [ ] Slow network (throttle) and high latency
- [ ] Packet loss and dropped connections: timeouts and retries are sensible
- [ ] Request and response inspected in a proxy (headers, payloads, status codes)
- [ ] API errors (400, 401, 403, 404, 500, 503) are handled with user-friendly messages
- [ ] Redirects, DNS failure and captive portal behaviour

## Quick network commands
```bash
adb shell ping -c 3 <host>
adb shell dumpsys connectivity
adb shell svc wifi disable
curl -i https://api.example.com/health
```
