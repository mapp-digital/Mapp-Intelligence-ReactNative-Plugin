# Expo development-build example

This is the Expo CNG companion to the existing `../example/` React Native CLI
app. Both examples expose configuration, page, action, campaign, ecommerce,
media, exception, webview, video, fetch, and plugin integration-test screens.
Keep `../example/` for CLI regression testing; do not convert it to Expo.

The validation target is Expo SDK 57.0.30, React Native 0.86.3, React 19.2.3,
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
The sample opts in to Expo SDK 57's iOS scene lifecycle through its existing
`expo-build-properties` entry in `app.json`.
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

The sample sets `ios.enableSceneSupport: true` in its `expo-build-properties`
options for Xcode 27 / iOS 27. Expo owns the scene manifest and AppDelegate
migration during prebuild. This requires Expo 57.0.23 or newer within SDK 57 and
an updated `expo-build-properties`, both already installed by the sample.
Remove the option after upgrading to SDK 58. See
[Expo's scene lifecycle guide](https://github.com/expo/fyi/blob/main/ios-scene-lifecycle.md#staying-on-sdk-57-with-xcode-27).

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
