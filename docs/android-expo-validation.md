# Android Expo integration validation

The Android library uses the consuming application's Android, Kotlin, and React
Native Gradle plugins. React Native's plugin selects `react-android` and manages
codegen. SDK values come from the root project's extensions, with the library's
existing SDK values as fallbacks. Codegen reads this package's sources.

Expo discovers the React Native package through autolinking. A small Android-only
config plugin is required by the SDK 56 generated Gradle setup: Mapp Android SDK
5.1.14 contains Kotlin 2.3 metadata, but the default compiler is 2.1.20.
`expo-build-properties` alone changed the reported version without changing the
versionless Kotlin compiler dependency, and the build still failed.

The library's `app.plugin.js` defaults `android.kotlinVersion` to 2.3.20 only when
absent and binds the template's versionless Kotlin buildscript dependency to that
property. Existing property values and explicitly versioned dependencies remain
app-owned. The example also demonstrates an explicit app override through
`expo-build-properties`. There are no manifest modifications. Use a development
build, not Expo Go. Kotlin 2.3.20 is selected because Expo SDK 56's Pika 0.3.2
compiler plugin publishes that variant; 2.3.21 has no matching artifact.

## Compatibility targets

| App | Expo | React Native | React | Kotlin |
| --- | --- | --- | --- | --- |
| Existing `example/` (CLI regression) | — | 0.84.1 | 19.2.3 | 2.3.21 |
| Separate `example-expo/` (validation target) | 56.0.0 | 0.85.3 | 19.2.3 | 2.3.20 (app override) |

Expo SDK 56 uses React Native 0.85 ([release notes](https://expo.dev/changelog/sdk-56)).
The supported Android matrix is React Native 0.84 and 0.85. React Native CLI
0.84.1 and Expo SDK 56 / React Native 0.85.3 were validated below. iOS
compatibility remains an independent plan item.

## Acceptance checks

| Check | Result |
| --- | --- |
| Existing CLI Android APK build, arm64 | Passed |
| Expo clean Android prebuild | Passed |
| Repeated clean prebuild | Passed: final Kotlin config, all 36 files identical |
| Expo autolinking discovery | Passed: generated package list and codegen sources |
| Android config-plugin regression tests | Passed: 4 tests |
| Expo JavaScript bundling | Passed |
| Library package/source/type build | Passed; config plugin included, example excluded |
| Expo Android APK build | Passed, arm64 development APK |
| Expo TurboModule initialization and page tracking call | Passed: Maestro observed `MAPP_TRACKING_OK`; no runtime errors |
| CLI runtime regression | Passed: existing Maestro integration flow |

## Reproduce

Follow [the Expo example instructions](../example-expo/README.md) to install the
isolated dependencies. In `example-expo/`, run:

```sh
npm run test:prebuild
npm run build:android -- -PreactNativeArchitectures=arm64-v8a
npm run android
```

The app declares `sdkVersion: 56.0.0`, allowing the literal `expo prebuild
--clean` command to resolve the matching SDK 56 template. The regression checks
all generated files before Gradle adds build outputs. Native directories are
ignored, so a clean checkout exercises CNG.

Open the app through its development client and Metro, then use the **Run smoke
test** button or `npm run test:integration`. The test requires the TurboModule,
initializes it, checks `isInitialized()`, and awaits `trackPage()`. The reserved
`example.invalid` domain means this validates the native call, not delivery to a
tracking account.

Keep using `example/` for CLI testing. Build/install it, start its Metro server,
and run its existing `yarn test:integration` Maestro flow. Both examples passed
on the Pixel_10 emulator. The broader plan still requires independent iOS
validation and release preparation.
