# Expo development-build example

This is the Expo CNG companion to the existing `../example/` React Native CLI
app. Both examples expose configuration, page, action, campaign, ecommerce,
media, exception, webview, video, fetch, and plugin integration-test screens.
Keep `../example/` for CLI regression testing; do not convert it to Expo.

The validation target is Expo SDK 56.0.0, React Native 0.85.3, React 19.2.3,
Kotlin 2.3.20, Android SDK 24/36/36, and iOS 15.1. Native directories are
generated and ignored by Git.

**Expo Go is unsupported; a development build is required.**

## Install and generate

Use npm in this directory so the Expo dependency tree stays independent of the
root Yarn workspace:

```sh
npm install
npm run prebuild
```

`npm run test:prebuild` performs two clean Android and iOS prebuilds and compares
the generated projects for idempotence. It deletes and regenerates both native
directories, so keep native settings in `app.json` or config plugins.

The package's plugin configures the Kotlin compiler required by the Android SDK.
This example has two additional app-local plugins: one constrains AndroidX
Lifecycle for the combined Mapp Engage/video dependency graph, and one adds
Mapp Engage's `AppoxeeConfig.plist` to the generated iOS target. Neither setting
belongs to the published Mapp Intelligence package.

## Build and run

Android:

```sh
npm run prebuild:android
npm run build:android -- -PreactNativeArchitectures=arm64-v8a
npm run android
```

iOS, on a macOS host with full Xcode and CocoaPods:

```sh
npm run prebuild:ios
npm run build:ios
npm run ios
```

Start Metro for an already installed development client with `npm start`.
Re-run Prebuild and rebuild the native app after changing the library or native
configuration. Because `.npmrc` installs the local library as a copied package,
remove `node_modules/mapp-intelligence-reactnative-plugin` and run `npm install`
again after changing package files.

## Verification

Check both JavaScript platforms and generated native projects:

```sh
npm run typecheck
npm run bundle:check
npm run config:check
npm run test:prebuild
```

With a development build installed, an emulator or device connected, and Metro
running, execute:

```sh
npm run test:integration
```

The Maestro flow opens the comprehensive plugin test screen, initializes the
TurboModule, and awaits representative page, action, ecommerce, campaign,
session, user, media, exception, and configuration operations. The complete
command matrix and latest results are in the
[integration validation guide](../docs/android-expo-validation.md).
