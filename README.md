# mapp-intelligence-reactnative-plugin

The Mapp Intelligence SDK tracks user activity, screen flow, ecommerce, and
media usage in React Native applications.

## Compatibility and upgrade impact

There is no breaking JavaScript or TypeScript API change. This integration does
not require manual native module registration, and the React Native peer range
has been expanded from 0.84 to include 0.85.

The Android library now uses the React Native, Android, Kotlin, SDK, and Gradle
configuration supplied by the consuming application. Standard React Native CLI
and Expo-generated projects already provide the required Gradle plugins. A
custom Android project that does not use the standard React Native Gradle setup
must provide the `com.android.library`, `org.jetbrains.kotlin.android`, and
`com.facebook.react` plugins.

There is no new Kotlin migration for an existing CLI application that already
builds published version 1.1.3. That version already uses Mapp Android SDK
5.1.14, whose Kotlin 2.3 metadata requires a compatible compiler, and its CLI
example already uses Kotlin 2.3.21. The new package does not replace the CLI
application's Kotlin version. For Expo SDK 56, the config plugin supplies Kotlin
2.3.20 only when the application has not selected a version.

| Integration | Expo | React Native | React | Android toolchain | Native target |
| --- | --- | --- | --- | --- | --- |
| React Native CLI | — | 0.84.1 | 19.2.3 | Kotlin 2.3.21, Gradle 9.0, Java 21 | Android min/compile/target SDK 24/36/36; iOS 15.1, Xcode 16.1+ |
| Expo development build | 56.0.0 | 0.85.3 | 19.2.3 | Kotlin 2.3.20, Gradle 9.3.1, Java 21 | Android min/compile/target SDK 24/36/36; iOS 15.1, Xcode 16.1+ |

The package peer dependencies are React `^19.2.3` and React Native
`>=0.84.0 <0.86.0`.

Existing consumers should use the [migration guide](docs/MIGRATION.md) for the
CLI upgrade checklist and the alternatives for adopting Expo.

## React Native CLI integration

### 1. Install the package

From the React Native application directory, run one of these commands:

```sh
npm install mapp-intelligence-reactnative-plugin
```

```sh
yarn add mapp-intelligence-reactnative-plugin
```

React Native autolinking discovers the Android and iOS implementations. Do not
add the package manually to `settings.gradle`, `MainApplication`, or the Xcode
project.

### 2. Check the Android toolchain

Skip this step when building only iOS. The application must use Android min SDK
24 or newer, compile SDK 36 or newer, and a Kotlin 2.3 compiler. The validated
CLI example uses this root `android/build.gradle` configuration:

```gradle
buildscript {
    ext {
        minSdkVersion = 24
        compileSdkVersion = 36
        targetSdkVersion = 36
        kotlinVersion = "2.3.21"
    }

    dependencies {
        classpath("com.android.tools.build:gradle")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:${kotlinVersion}")
    }
}
```

Keep the Android Gradle Plugin and Gradle wrapper versions selected by the
application's React Native version.

### 3. Install iOS pods

Skip this step when building only Android. From the application directory, run:

```sh
cd ios
pod install
cd ..
```

If the application manages CocoaPods through Bundler, run `bundle exec pod install`
instead.

### 4. Rebuild the native application

For Android:

```sh
npx react-native run-android
```

For iOS:

```sh
npx react-native run-ios
```

A Metro reload cannot install or update native SDK code. Rebuild and reinstall
the application after adding or upgrading this package.

### 5. Initialize and use the SDK

Add the initialization before sending tracking calls. Replace the tracking ID
and domain with the values for your Mapp Intelligence account:

```ts
import {
  LogLevel,
  MappIntelligencePlugin,
} from 'mapp-intelligence-reactnative-plugin';

export async function initializeMappIntelligence() {
  const trackingIds = [123456789012345]; // Replace with your numeric ID.
  const trackingDomain = 'https://tracking.example.com'; // Replace this domain.

  await MappIntelligencePlugin.initWithConfiguration(
    trackingIds,
    trackingDomain
  );
  await MappIntelligencePlugin.setLogLevel(LogLevel.all);
  await MappIntelligencePlugin.build();
}
```

Call it once during application startup:

```ts
await initializeMappIntelligence();
```

### 6. Verify initialization and tracking

After `build()` resolves, make a representative tracking call:

```ts
const initialized = await MappIntelligencePlugin.isInitialized();

if (!initialized) {
  throw new Error('Mapp Intelligence did not initialize');
}

await MappIntelligencePlugin.trackPage('Application started');
```

The retained [`example/`](example/) application contains the complete React
Native CLI integration and tracking examples.

## Expo integration

### 1. Confirm that the app uses a development build

**Expo Go is unsupported; a development build is required.** This package
contains Android and iOS native code that is not included in Expo Go. See Expo's
[development build documentation](https://docs.expo.dev/develop/development-builds/introduction/)
for the native development workflow.

### 2. Install the development client and package

From the Expo application directory, run:

```sh
npx expo install expo-dev-client
npm install mapp-intelligence-reactnative-plugin
```

Yarn users can install the library with:

```sh
yarn add mapp-intelligence-reactnative-plugin
```

### 3. Add the package config plugin

Add `mapp-intelligence-reactnative-plugin` to the `plugins` array in `app.json`:

```json
{
  "expo": {
    "plugins": ["mapp-intelligence-reactnative-plugin"]
  }
}
```

For a JavaScript or TypeScript Expo configuration, add the same package name to
the returned `expo.plugins` array.

The config plugin changes only the generated Android Kotlin configuration. It
does not modify Android manifests or generated iOS projects. It preserves an
app-provided Kotlin version; when none is present for Expo SDK 56, it supplies
Kotlin 2.3.20, which is compatible with the Mapp Android SDK metadata and Expo's
compiler plugins.

### 4. Generate clean native projects

Run Expo Prebuild after adding the package plugin:

```sh
npx expo prebuild --clean
```

This applies the config plugin and lets React Native autolinking add the module
to both generated projects. Keep native configuration in Expo app configuration
or config plugins so repeated clean prebuilds remain reproducible. Expo explains
this workflow in its
[Continuous Native Generation documentation](https://docs.expo.dev/workflow/continuous-native-generation/).

### 5. Build and install the development application

For Android:

```sh
npx expo run:android
```

For iOS:

```sh
npx expo run:ios
```

### 6. Start Metro for the development client

After installing the native development application, run:

```sh
npx expo start --dev-client
```

Open the installed development application rather than Expo Go.

### 7. Initialize and verify tracking

Use the same `initializeMappIntelligence()`, `isInitialized()`, and `trackPage()`
code shown in the React Native CLI steps. The JavaScript and TypeScript API is
identical in both integration types.

Re-run `npx expo prebuild --clean` and rebuild the development application after
installing, upgrading, or changing the native configuration for this package.
JavaScript-only application changes require only a Metro reload.

The separate [`example-expo/`](example-expo/README.md) application contains the
complete Expo development-build integration and the same tracking screens as
the CLI example.

## Repository verification

The repeatable package, Prebuild, Android, iOS, and runtime verification commands
and their latest results are documented in the
[Expo and React Native CLI validation guide](docs/android-expo-validation.md).

[Read the Mapp SDK documentation](https://docs.mapp.com/docs/react-native-sdk)
for all configuration and tracking operations.

## Contributing

See the [contributing guide](CONTRIBUTING.md) for the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
