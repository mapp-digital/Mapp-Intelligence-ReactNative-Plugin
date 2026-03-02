# Changelog

All notable changes to this project are documented in this file.

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
