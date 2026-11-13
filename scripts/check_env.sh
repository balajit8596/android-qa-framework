#!/usr/bin/env bash
# Verifies the machine is ready to run the Android tests.
set -u

ok()   { printf '  [ok]   %s\n' "$1"; }
bad()  { printf '  [FAIL] %s\n' "$1"; FAILED=1; }
FAILED=0

echo "Checking environment..."

command -v node >/dev/null && ok "node $(node --version)" || bad "node not found"
command -v npm  >/dev/null && ok "npm $(npm --version)"   || bad "npm not found"
command -v java >/dev/null && ok "java present"            || bad "java not found (needed by Appium/Android tools)"
command -v adb  >/dev/null && ok "$(adb version | head -n1)" || bad "adb not on PATH (install Android platform-tools)"

if [ -n "${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}" ]; then
  ok "ANDROID_HOME/ANDROID_SDK_ROOT is set"
else
  bad "ANDROID_HOME (or ANDROID_SDK_ROOT) is not set"
fi

if command -v adb >/dev/null; then
  count=$(adb devices | tail -n +2 | grep -c "device$" || true)
  if [ "$count" -ge 1 ]; then
    ok "$count device(s) connected"
  else
    bad "no device or emulator connected (start an emulator or enable USB debugging)"
  fi
fi

[ -d node_modules ] && ok "dependencies installed" || bad "run: npm install"

exit "$FAILED"
