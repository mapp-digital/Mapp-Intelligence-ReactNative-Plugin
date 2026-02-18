# Changelog

All notable changes to this project are documented in this file.

## [1.1.2] - 2026-02-11

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
