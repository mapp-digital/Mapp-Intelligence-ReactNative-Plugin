# Changelog

All notable changes to this project are documented in this file.

## [2.0.0] - 2026-09-15

### Expo support

- Added package-level Expo config-plugin support for Expo Prebuild and Continuous Native Generation (CNG).
- Added support for Expo SDK 56 development builds using React Native 0.85.3. **Expo Go is unsupported because this package contains native code.**
- Made repeated clean Expo prebuilds safe and reproducible. The package does not require Android manifest or iOS project changes.
- Added the Expo config-plugin entry point and required native files to the published npm package.

### React Native and Android compatibility

- Expanded the supported React Native peer range from `>=0.84.0 <0.85.0` to `>=0.84.0 <0.86.0`.
- Removed the hard-coded `react-android:0.84.1` dependency. The consuming application's React Native Gradle plugin now selects the matching React Native Android artifact.
- Removed package-local Android Gradle Plugin and Kotlin plugin pins. The library now uses the compatible Gradle plugins, Kotlin compiler, and Android SDK values supplied by a standard React Native CLI or Expo-generated application.
- Preserved an Expo application's explicitly configured Kotlin version. For the validated Expo SDK 56 setup, the config plugin supplies Kotlin 2.3.20 only when the application has not selected a version.
- Retained Android SDK fallbacks of min SDK 24, compile SDK 36, and target SDK 36.

### Upgrade notes

- There are no breaking JavaScript or TypeScript API changes. Existing initialization, configuration, and tracking calls continue to work.
- A React Native CLI application that already builds version 1.1.3 with compatible Kotlin and Android SDK settings does not need a Kotlin migration. Standard React Native autolinking remains unchanged.
- Custom Android Gradle projects must make the `com.android.library`, `org.jetbrains.kotlin.android`, and `com.facebook.react` plugins available to the library.
- Reinstall iOS pods and rebuild the native Android and iOS applications after upgrading. A Metro reload alone cannot apply native package changes.
- Expo applications must register `mapp-intelligence-reactnative-plugin` in the Expo `plugins` array, run a clean prebuild, and create a new development build.
- See the [migration guide](docs/MIGRATION.md) for the React Native CLI upgrade checklist and Expo adoption steps.

### Examples and verification

- Kept the existing React Native CLI example for regression testing and added a separate Expo development-build example with equivalent tracking functionality.
- Added documented checks for Expo config resolution, idempotent clean prebuilds, Android and iOS native builds, TurboModule initialization, representative tracking operations, and existing React Native CLI builds.

## [1.1.3] - 2026-08-07

### React Native & Dependencies

- Migrated the plugin and example app to React Native 0.84.1 and React 19.2.3.
- Updated the supported peer range to React Native `>=0.84.0 <0.85.0`.
- Updated Android tooling to AGP 8.12.0, Gradle 9.0.0, and Kotlin 2.3.21.
- Raised the required Node.js version to 22.13 and aligned the iOS deployment target to 15.1.

### Bug Fixes

- Applied the configured user-matching flag during Android SDK initialization so `setEnableUserMatching(true)` before `build()` is reflected in the active SDK configuration.
- Made the iOS user-matching promise resolve only after the native setter runs on the main queue.
- Removed the obsolete direct `RCT-Folly` pod dependency, avoiding iOS dependency conflicts for client apps using React Native 0.84.

## [1.1.2] - 2026-02-26

### Bug Fixes

- **Android null-safety:** Fixed crashes when optional tracking parameters are omitted. The native `MappinteligencePluginModule` methods (`trackCustomPage`, `trackAction`, `trackPageWithCustomData`, `trackMedia`) now accept nullable `ReadableMap` parameters in line with the TurboModule spec and JS API.
- **iOS NSNull handling:** Hardened `trackPageWithCustomData` and `trackMedia` bridges to safely handle `NSNull` inputs coming from JavaScript, avoiding native exceptions for missing/optional parameters.
- **Example WebView hook error:** Resolved "Invalid hook call" in the WebView tracking example by ensuring a single React instance is used via Metro configuration and peer dependency alignment.

### Testing & Tooling

- **PluginIntegrationTest screen:** Added a dedicated `PluginIntegrationTest` screen in the example app that exercises all public plugin APIs (configuration, page, action, campaign, ecommerce, manual media, and safe exception tracking) and reports pass/fail per function.
- **Maestro integration tests:** Added a Maestro flow (`example/.maestro/flows/plugin-integration-test.yaml`) and wiring to run the full integration suite locally or in CI (e.g. `cd example && yarn test:integration`), providing regression protection against crashes and native/JS contract mismatches.
- **Documentation:** Extended `helper.md` with instructions for running the example app against a published version of the plugin and for running the new integration tests.

## [1.1.1] - 2026-02-11

### React Native & Dependencies

- **React Native:** Plugin now requires React Native `>=0.83.0 <0.84.0`.
- **React:** Supports React `^18.0.0` or `^19.0.0`.
- **Android Gradle Plugin:** Plugin built with AGP 8.10.1; ensure your app’s Android build is compatible.

### Android Native (Client Impact)

- **minSdkVersion:** Plugin uses `minSdkVersion` 24. Your app must use at least 24 if you rely on the plugin’s native code.
- **compileSdkVersion / targetSdkVersion:** Plugin targets `compileSdkVersion` 36 and `targetSdkVersion` 36. Gradle will resolve conflicts; align your app if you hit build errors.
- **Gradle:** Plugin uses Gradle 8.14.3. Ensure your app’s Gradle version is compatible when building.
- **Kotlin:** Plugin requires Kotlin 2.3.0. Your app’s Kotlin version should be compatible (2.3.x recommended when using New Architecture).
- **New Architecture:** Plugin is compatible with React Native New Architecture (TurboModules). No app changes needed when `newArchEnabled=true`.

### iOS Native (Client Impact)

- **Vendored SDK:** The iOS SDK is now bundled as `ios/Frameworks/MappIntelligenceiOS.xcframework` via the podspec (no CocoaPods dependency on `MappIntelligence`).
- **Podspec:** Updated to use `vendored_framework`, `preserve_path`, and `public_header_files` for the bundled framework.
