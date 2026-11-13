#!/usr/bin/env bash
# One-command smoke run: check the environment, run fast tests, then device smoke tests.
set -euo pipefail

bash scripts/check_env.sh
npm run test:unit
npm run test:smoke
