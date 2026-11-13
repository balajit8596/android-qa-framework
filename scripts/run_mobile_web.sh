#!/usr/bin/env bash
# Runs the mobile-web suite on emulated Android devices (no phone needed).
# Usage: scripts/run_mobile_web.sh [playwright args], for example: --project=pixel-7
set -euo pipefail

command -v node >/dev/null || { echo "node not found"; exit 1; }
[ -d node_modules ] || npm install

npx playwright install chromium
npx playwright test "$@"

echo
echo "HTML report: reports/playwright/index.html  (open with: npm run report:mobile-web)"
echo "Videos and screenshots: artifacts/playwright/"
