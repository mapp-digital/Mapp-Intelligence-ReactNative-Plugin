# Development Guide

This guide explains how to clean the project, install dependencies, and build and run both sample apps for the Mapp Intelligence React Native Plugin:

- `example/` verifies a standard React Native CLI integration.
- `example-expo/` verifies Expo CNG, prebuild, and development-build integration.

**Package manager:** This repository is set up for **Yarn 3** (workspaces, `resolutions`, `.yarnrc.yml`). Use **`yarn install`** for root and CLI workspace dependencies. The separate `example-expo/` app uses its own npm install; see [its README](example-expo/README.md).

---

## Project structure

- **Root** – The plugin library (`mapp-intelligence-reactnative-plugin`) and its native code (`android/`, `ios/`).
- **example/** – The existing React Native CLI app, retained for CLI regression testing.
- **example-expo/** – A separate Expo CNG app with isolated dependencies and generated native projects for Expo testing.

**Linking:** The example app uses **React Native autolinking** for the local plugin. `example/react-native.config.js` points the dependency to the repo root, and `example/android/settings.gradle` passes a custom lockfile list (including the root `yarn.lock`) so the autolinking cache invalidates when workspace deps change. No manual `build.gradle` or `MainApplication` changes are needed. Always run Android from the **example** folder: `cd example` then `yarn android`.

---

## Prerequisites

- **Node.js** ≥ 22.13
- **Yarn** (v3) – The repository root and React Native CLI example use Yarn workspaces (`packageManager: yarn@3.6.1`).
- **npm** – The Expo example has an independent npm dependency tree and committed `package-lock.json`.
- **Android:** Android Studio, SDK, and environment variables (e.g. `ANDROID_HOME`)
- **iOS:** A full Xcode installation and CocoaPods (`bundle` and `pod` from the `example` directory)
- **React Native CLI:** Used via `npx react-native` (no global install required)
- **Expo CLI:** Used through the scripts in `example-expo/package.json` (no global install required)
- **Maestro:** Optional, for running the integration flows on an installed app

---

## 1. Clean script (`clean.sh`)

The `clean.sh` script removes build artifacts, caches, and dependency trees so you can start from a clean state. Use it when you change branches, upgrade React Native, or hit obscure build/cache issues.

### What it removes

| Location   | Removed |
|-----------|---------|
| **Root**  | `node_modules`, `yarn.lock`, `package-lock.json`, `lib/`, Android build dirs (`.gradle`, `build`, etc.), iOS (`Pods`, `build`, `DerivedData`, `*.xcworkspace`) |
| **example** | Same for the CLI example app: `node_modules`, lockfiles, Android and iOS build/cache dirs |
| **example-expo** | `node_modules`, generated Android/iOS projects, and local Expo/Metro caches; its committed npm lockfile is preserved |
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

Use **Yarn** from the **repository root** so the library and React Native CLI example get the correct workspace dependency tree.

```bash
# From repo root (required: use Yarn)
yarn install
```

The CLI example depends on the local plugin via **`file:..`**.

This will:

- Install root dependencies and build the library (`lib/` via the `prepare` script).
- Install the CLI example dependencies and link the local plugin.

Install the Expo example separately with npm:

```bash
cd example-expo
npm install
cd ..
```

The Expo example also depends on the plugin through `file:..`. Its `.npmrc` enables `install-links`, so npm copies the package into `example-expo/node_modules`. This keeps Expo's dependency tree isolated from the Yarn workspace.

**iOS only** – Install CocoaPods dependencies for the example app:

```bash
cd example
npx pod-install
# or: bundle exec pod install
cd ..
```

---

## 3. Build and run the React Native CLI example

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

Metro can also be started from the repository root. The root configuration delegates to the example app:

```bash
npm start
# or
yarn start
```

---

## 4. Build and run the Expo example

Expo Go cannot load this plugin because it contains custom native Android and iOS code. Use an Expo **development build**.

Run these commands from the Expo app directory:

```bash
cd example-expo
npm install
```

### Validate the Expo configuration and prebuild

Check that Expo resolves the local package and its config plugin, then generate both native projects twice to verify that clean prebuilds are repeatable:

```bash
npm run config:check
npm run typecheck
npm run bundle:check
npm run test:prebuild
```

For a normal clean prebuild, use one of these commands:

```bash
npm run prebuild          # Android and iOS
npm run prebuild:android  # Android only
npm run prebuild:ios      # iOS only
```

The generated `example-expo/android/` and `example-expo/ios/` directories are ignored by Git. Treat `app.json`, package config plugins, and native source files in the package as the source of truth instead of editing generated projects.

### Android development build

Start an emulator or connect a device, then build, install, and launch the development client:

```bash
cd example-expo
npm run android
```

To compile a debug APK without installing it:

```bash
npm run prebuild:android
npm run build:android
```

For a faster emulator-only check when the host supports an ARM64 emulator:

```bash
npm run build:android -- -PreactNativeArchitectures=arm64-v8a
```

### iOS development build

On macOS with a full Xcode installation, generate the native project and build, install, and launch the development client:

```bash
cd example-expo
npm run ios
```

To compile without launching the app:

```bash
npm run prebuild:ios
npm run build:ios
```

### Start Metro separately

The run commands can start Metro. To manage it in a separate terminal:

```bash
# Terminal 1
cd example-expo
npm start

# Terminal 2
cd example-expo
npm run android # or: npm run ios
```

`npm start` uses `expo start --dev-client`, which targets the installed development build rather than Expo Go.

### Verify module initialization and tracking

The Expo app exposes the same Plugin Integration Test functionality as the CLI app. After installing the development build:

1. Open **Plugin Integration Test**.
2. Tap **Run All Plugin Tests**.
3. Confirm that the module initializes and the representative tracking operations finish with 0 failures.

To run the flow with Maestro, keep Metro running and use another terminal:

```bash
cd example-expo
npm run test:integration
```

The development build must already be installed on a connected emulator, simulator, or device.

### Rebuild after package changes

Native package installation or native configuration changes require a new development build. Because npm copies the local package, refresh that copy after changing the library. Run this sequence from the repository root:

```bash
rm -rf example-expo/node_modules/mapp-intelligence-reactnative-plugin
cd example-expo
npm install
npm run prebuild
npm run android # or: npm run ios
```

JavaScript-only app changes normally require only a Metro reload. See [Expo validation](docs/android-expo-validation.md) for the complete repeatable validation sequence.

---

## 5. Testing with the published plugin

By default, the React Native CLI example uses the **local** plugin via `file:..`. Two root-level scripts switch both dependency resolution and React Native autolinking between the local and published plugin.

### Switch to the published plugin

From the repository root:

```bash
yarn plugin:published
yarn install
```

This selects the root package's current version from npm and installs it. The version must already be published and support React Native 0.84. To select a different published version, pass it after the script name, for example `yarn plugin:published 1.1.3-beta02`, and then run `yarn install`.

### Switch back to the local plugin

```bash
yarn plugin:local
yarn install
```

The switch commands update `example/package.json`; the following install applies the selected dependency. With npm, use `npm run plugin:local` or `npm run plugin:published`, followed by `npm install`. The example's `react-native.config.js` forces the repository root only in local mode; published mode uses normal package autolinking.

### Rebuild native projects

Because the plugin has native code, rebuild the apps:

**Android:**
```bash
cd example
npx react-native run-android
# or for a clean build:
yarn android:clean
```

**iOS:**
```bash
cd example
npx pod-install
npx react-native run-ios
```

### Clear Metro cache (if needed)

If you see stale behavior:

```bash
cd example
npx react-native start --reset-cache
```

---

## 6. Full reset workflow

Use this when you want a completely fresh environment after pulling changes or switching branches.

For the React Native CLI example:

```bash
./clean.sh
yarn install
cd example && npx pod-install && cd ..
cd example && npx react-native run-android
# or for iOS:  npx react-native run-ios
```

For the Expo example:

```bash
./clean.sh
yarn install
cd example-expo
npm install
npm run test:prebuild
npm run android # or: npm run ios
```

---

## 7. React Native CLI Plugin Integration Test

The example app includes a **Plugin Integration Test** screen that exercises all plugin methods (with full and null params) and detects exceptions. Use it to catch regressions like nullable→non-nullable parameter changes.

**Run manually:**
1. Launch the example app (`cd example && npx react-native run-android`)
2. Tap **Plugin Integration Test** on the home screen
3. Tap **Run All Plugin Tests**
4. Verify all tests pass (0 failed)

**Run with Maestro (E2E):** Install [Maestro](https://maestro.mobile.dev/) then:

```bash
cd example
yarn test:integration
```

Or: `maestro test example/.maestro/flows/plugin-integration-test.yaml`

---

## 8. Run library tests

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

## 9. Optional: manual cache cleanup

If you still see odd build or Metro issues, you can clear global caches (optional):

| Purpose              | Command |
|----------------------|--------|
| Xcode DerivedData    | `rm -rf ~/Library/Developer/Xcode/DerivedData` |
| Watchman (file watch)| `watchman watch-del-all` |
| Gradle user cache    | `rm -rf ~/.gradle/caches` |

Run these only when needed; they are not required for the normal clean → install → run flow.
