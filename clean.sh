#!/bin/bash
set -e
cd "$(dirname "$0")"

echo "Cleaning React Native project caches..."

# Root: deps, lockfiles, built lib, native build artifacts
rm -rf \
  node_modules \
  yarn.lock \
  package-lock.json \
  lib \
  android/.gradle \
  android/build \
  android/.idea \
  android/local.properties \
  ios/Pods \
  ios/build \
  ios/DerivedData \
  ios/*.xcworkspace

# Metro / bundler caches (project-local)
rm -rf .metro 2>/dev/null || true

# Example app: same
rm -rf \
  example/node_modules \
  example/yarn.lock \
  example/package-lock.json \
  example/android/.gradle \
  example/android/build \
  example/android/app/build \
  example/android/.idea \
  example/android/local.properties \
  example/ios/Pods \
  example/ios/build \
  example/ios/DerivedData \
  example/ios/*.xcworkspace

rm -rf .metro example/.metro 2>/dev/null || true

echo ""
echo "Optional (run manually if needed):"
echo "  Global Xcode DerivedData:  rm -rf ~/Library/Developer/Xcode/DerivedData"
echo "  Watchman:                  watchman watch-del-all"
echo "  Gradle user cache:         rm -rf ~/.gradle/caches"
echo ""
echo "Next steps for a fresh state:"
echo "  1. npm install          (or yarn install from repo root)"
echo "  2. cd example && npx pod-install   (for iOS)"
echo "  3. npx react-native run-android   or  run-ios"
echo ""
echo "✅ Cleanup complete."
