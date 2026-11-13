# adb Cheat Sheet

## Devices
```bash
adb devices                         # list devices (state must be "device")
adb -s emulator-5554 shell          # target a specific device
adb kill-server && adb start-server # fix a stuck adb
adb shell getprop ro.build.version.release   # Android version
adb shell getprop ro.product.model           # model
```

## Apps
```bash
adb install -r app.apk                 # install or reinstall
adb uninstall com.example.app
adb shell pm list packages | grep example
adb shell pm clear com.example.app     # wipe app data
adb shell am force-stop com.example.app
adb shell am start -n com.example.app/.MainActivity
adb shell pm grant com.example.app android.permission.CAMERA
adb shell pm revoke com.example.app android.permission.CAMERA
adb shell dumpsys package com.example.app    # permissions, version, flags
```

## Logs and diagnostics
```bash
adb logcat                         # live log
adb logcat -c                      # clear
adb logcat -d > log.txt            # dump to file
adb logcat *:E                     # errors only
adb logcat | grep -i "exception"   # filter (Linux/macOS/Git Bash)
adb logcat -b crash                # crash buffer only
adb bugreport bugreport.zip        # full diagnostic bundle
adb shell dumpsys meminfo com.example.app
adb shell dumpsys battery
adb shell dumpsys activity activities | grep -i resumed   # current foreground activity
```

## Files and media
```bash
adb push local.txt /sdcard/
adb pull /sdcard/file.txt .
adb shell screencap -p /sdcard/s.png && adb pull /sdcard/s.png
adb shell screenrecord /sdcard/r.mp4      # Ctrl+C to stop, then adb pull
```

## Network
```bash
adb shell svc wifi disable|enable
adb shell svc data disable|enable
adb shell settings put global airplane_mode_on 1
adb shell ping -c 3 8.8.8.8
adb shell ip addr show wlan0
adb shell dumpsys connectivity
adb shell dumpsys wifi | grep "Wi-Fi is"
```

## Input and UI
```bash
adb shell input tap 500 1000
adb shell input swipe 500 1500 500 500
adb shell input text "hello"
adb shell input keyevent 4         # back (3 = home, 26 = power)
adb shell uiautomator dump         # UI hierarchy XML
adb shell wm size                  # screen resolution
```

## Crash triage workflow
1. `adb logcat -c`, then reproduce the problem.
2. `adb logcat -d > log.txt`, search for `FATAL EXCEPTION` or `ANR in`.
3. Note the exception, the first app frame in the stack, device, OS and build.
4. Attach log, screenshot or video and steps to the defect.
