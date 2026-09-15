# Expo and React Native CLI validation

This guide records repeatable checks for the published package, the Expo CNG
example, and the retained React Native CLI example. Run native iOS commands on a
macOS host with full Xcode selected through `xcode-select` and CocoaPods
installed.

## Integration behavior

The Android library applies the consuming application's Android, Kotlin, and
React Native Gradle plugins. React Native's plugin selects `react-android` and
manages codegen. Android SDK values come from the root project when present,
with library fallbacks for compatible CLI layouts. There is no hard-coded React
Native Maven version.

Expo discovers the package through React Native autolinking. Its package-level
`app.plugin.js` supplies Kotlin 2.3.20 for Expo SDK 56 only when the application
has not selected a version, then binds the generated versionless Kotlin
buildscript dependency to that property. Existing Kotlin properties and
explicit dependency versions remain app-owned. The plugin makes no Android
manifest or iOS project changes because the Intelligence module does not require
them.

## Validated targets

| App | Expo | React Native | React | Kotlin | Gradle | Native target |
| --- | --- | --- | --- | --- | --- | --- |
| `example/` CLI regression | — | 0.84.1 | 19.2.3 | 2.3.21 | 9.0 | Android 24/36/36; iOS 15.1, Xcode 16.1+ |
| `example-expo/` development build | 56.0.0 | 0.85.3 | 19.2.3 | 2.3.20 | 9.3.1 | Android 24/36/36; iOS 15.1, Xcode 16.1+ |

Android builds use Java 21. React Native 0.84.1 and 0.85.3 both declare Xcode
16.1 as their minimum. The package peer range is React Native
`>=0.84.0 <0.86.0`.

## Automated package and CNG checks

From the repository root:

```sh
npm test -- --runInBand
npm run typecheck
npm run test:expo-plugin
npm run test:package
```

`test:expo-plugin` covers absent and app-owned Kotlin settings, explicitly
versioned dependencies, and idempotence. `test:package` performs an `npm pack`
dry run and requires the config-plugin entry point, Android sources, iOS podspec
and XCFramework, JavaScript output, and TypeScript declarations while rejecting
example app files.

From `example-expo/`:

```sh
npm run typecheck
npm run bundle:check
npm run config:check
npm run test:prebuild
```

`test:prebuild` runs `expo prebuild --clean --platform all --no-install` twice
and compares both generated projects. Xcode object IDs are normalized before
comparison because clean Xcode project generation assigns new opaque IDs. The
current check compares 36 Android and 18 iOS files.

## Expo development builds and runtime

Android:

```sh
cd example-expo
npm run prebuild:android
npm run build:android -- -PreactNativeArchitectures=arm64-v8a
npm start
npm run test:integration
```

iOS:

```sh
cd example-expo
npm run prebuild:ios
npm run build:ios
npm start
npm run test:integration
```

Run Metro and the Maestro command in separate terminals. The integration flow
opens the plugin test route and validates TurboModule initialization plus
representative configuration, page, action, campaign, ecommerce, user, session,
media, and exception calls.

## React Native CLI regression

Android:

```sh
cd example
npm run build:android
npm start
npm run test:integration
```

iOS:

```sh
cd example/ios
bundle exec pod install
cd ..
npm run build:ios
npm start
npm run test:integration
```

## Results recorded on 2026-09-15

| Check | Result |
| --- | --- |
| Public JavaScript/TypeScript API diff against `main` | Passed: no `src/` changes |
| Expo config resolution and config-plugin tests | Passed: 4 tests |
| Clean all-platform prebuild, repeated twice | Passed: 36 Android and 18 iOS files identical after normalization |
| Expo Android arm64 development APK | Passed |
| Expo Android TurboModule and representative tracking flow | Passed on Pixel_10 emulator; Maestro reached `plugin-test-all-passed` |
| Expo Android and iOS JavaScript bundles | Passed |
| Expo iOS autolinking/codegen discovery during CocoaPods resolution | Passed: Intelligence TurboModule and native package discovered |
| Expo iOS native build/runtime | Not run on this host: full Xcode is unavailable |
| CLI Android arm64 APK | Passed |
| CLI Android runtime integration | Passed on Pixel_10 emulator |
| CLI iOS native build/runtime | Not run on this host: full Xcode is unavailable |
| Library Jest suite and TypeScript build | Passed: 31 tests |
| Published artifact audit | Passed: 169 required package files checked; examples excluded |

The iOS commands above are the remaining release validation gate. The local
CocoaPods attempt reached autolinking and codegen discovery, then stopped because
the selected developer directory contains Command Line Tools rather than full
Xcode. This is an environment limitation rather than an autolinking error.
