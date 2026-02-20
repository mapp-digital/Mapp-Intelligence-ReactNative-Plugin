# Development Guide

This guide explains how to clean the project, install dependencies, and build and run the example app for the Mapp Intelligence React Native Plugin.

**Package manager:** This repository is set up for **Yarn 3** (workspaces, `resolutions`, `.yarnrc.yml`). Use **`yarn install`** for dependencies; do not use npm for installs in this repo.

---

## Project structure

- **Root** – The plugin library (`mapp-intelligence-reactnative-plugin`) and its native code (`android/`, `ios/`).
- **example/** – A sample React Native app that depends on the local plugin and is used for development and testing.

**Linking:** The example app uses **React Native autolinking** for the local plugin. `example/react-native.config.js` points the dependency to the repo root, and `example/android/settings.gradle` passes a custom lockfile list (including the root `yarn.lock`) so the autolinking cache invalidates when workspace deps change. No manual `build.gradle` or `MainApplication` changes are needed. Always run Android from the **example** folder: `cd example` then `yarn android`.

---

## Prerequisites

- **Node.js** ≥ 18
- **Yarn** (v3) – This project uses Yarn 3 with workspaces (`packageManager: yarn@3.6.1`). Use **Yarn** for installing dependencies; npm is not recommended and may cause issues with the local plugin and lockfiles.
- **Android:** Android Studio, SDK, and environment variables (e.g. `ANDROID_HOME`)
- **iOS:** Xcode, CocoaPods (`bundle` and `pod` from the `example` directory)
- **React Native CLI:** Used via `npx react-native` (no global install required)

---

## 1. Clean script (`clean.sh`)

The `clean.sh` script removes build artifacts, caches, and dependency trees so you can start from a clean state. Use it when you change branches, upgrade React Native, or hit obscure build/cache issues.

### What it removes

| Location   | Removed |
|-----------|---------|
| **Root**  | `node_modules`, `yarn.lock`, `package-lock.json`, `lib/`, Android build dirs (`.gradle`, `build`, etc.), iOS (`Pods`, `build`, `DerivedData`, `*.xcworkspace`) |
| **example** | Same for the example app: `node_modules`, lockfiles, Android and iOS build/cache dirs |
| **Caches** | Project-local Metro cache (`.metro`) |

It does **not** remove global caches (e.g. Xcode DerivedData, Gradle user cache, Watchman). Instructions for those are printed at the end of the script if you need them.

### How to run it

From the **repository root**:

```bash
# Make the script executable (once)
chmod +x clean.sh

# Run the clean
./clean.sh
```

The script changes into the repo root automatically, so it is safe to run from any subdirectory. After it finishes, follow the "Next steps" below to reinstall and run the app.

---

## 2. Install dependencies

Use **Yarn** from the **repository root** so both the library and the example app get the correct dependency tree (workspaces and the local plugin are wired for Yarn).

```bash
# From repo root (required: use Yarn)
yarn install
```

The example app depends on the local plugin via **`workspace:*`** (not `file:..`) so Yarn resolves it from the workspace graph and install stays light.

This will:

- Install root dependencies and build the library (`lib/` via the `prepare` script).
- Install the example app dependencies and link the local plugin.

**iOS only** – Install CocoaPods dependencies for the example app:

```bash
cd example
npx pod-install
# or: bundle exec pod install
cd ..
```

---

## 3. Build and run the example app

All commands below assume you are in the **repository root** unless stated otherwise.

### Android

```bash
cd example
npx react-native run-android
```

To build a debug APK without installing (e.g. for CI):

```bash
cd example/android
./gradlew app:assembleDebug
```

### iOS

```bash
cd example
npx react-native run-ios
```

To target a specific simulator:

```bash
npx react-native run-ios --simulator "iPhone 16"
```

### Metro bundler

If you run the app with a pre-started Metro server:

```bash
# Terminal 1 – start Metro from the example app root
cd example
npx react-native start

# Terminal 2 – run the app
cd example
npx react-native run-android   # or run-ios
```

---

## 4. Full reset workflow

Use this when you want a completely fresh environment (e.g. after pulling changes or switching branches):

```bash
./clean.sh
yarn install
cd example && npx pod-install && cd ..
cd example && npx react-native run-android
# or for iOS:  npx react-native run-ios
```

---

## 5. Run tests

Unit tests are in `src/__tests__/`. From the **repository root**:

```bash
# Run all tests
yarn test

# Run a specific test file
yarn test src/__tests__/index.test.tsx

# Run tests matching a pattern
yarn test --testPathPattern="__tests__/index"
```

---

## 6. Optional: manual cache cleanup

If you still see odd build or Metro issues, you can clear global caches (optional):

| Purpose              | Command |
|----------------------|--------|
| Xcode DerivedData    | `rm -rf ~/Library/Developer/Xcode/DerivedData` |
| Watchman (file watch)| `watchman watch-del-all` |
| Gradle user cache    | `rm -rf ~/.gradle/caches` |

Run these only when needed; they are not required for the normal clean → install → run flow.
