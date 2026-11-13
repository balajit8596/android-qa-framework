#!/usr/bin/env bash
# Collects diagnostic evidence from the connected device into a timestamped folder.
# Usage: scripts/collect_logs.sh [package]
set -euo pipefail

PKG="${1:-}"
OUT="artifacts/evidence_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$OUT"

echo "Collecting into $OUT"
adb logcat -d            > "$OUT/logcat.txt"
adb logcat -d '*:E'      > "$OUT/logcat_errors.txt"
adb shell getprop        > "$OUT/device_props.txt"
adb shell dumpsys battery > "$OUT/battery.txt"
adb shell dumpsys meminfo > "$OUT/meminfo.txt"
adb shell screencap -p /sdcard/evidence.png
adb pull /sdcard/evidence.png "$OUT/screenshot.png" >/dev/null

if [ -n "$PKG" ]; then
  adb shell dumpsys package "$PKG"  > "$OUT/package_$PKG.txt"
  adb shell dumpsys meminfo "$PKG"  > "$OUT/meminfo_$PKG.txt" || true
fi

# Quick triage: show crashes and ANRs if any.
echo "--- crashes / ANRs ---"
grep -E "FATAL EXCEPTION|ANR in" "$OUT/logcat.txt" || echo "none found"
echo "Done."
