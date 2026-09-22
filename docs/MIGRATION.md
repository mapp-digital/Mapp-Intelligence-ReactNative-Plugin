# Migration guide: React Native CLI and Expo

This guide covers migration from the package version `1.1.3` to Expo-compatible version `2.0.0`. It describes three paths:

1. Continue using a React Native CLI application.
2. Add the package to an existing Expo SDK 56 application.
3. Convert a React Native CLI application to Expo Prebuild/CNG.

## Is this a breaking change?

There is no breaking JavaScript or TypeScript API change. Existing imports,
initialization, configuration, and tracking calls remain valid. The package name
and React Native autolinking behavior are unchanged.

There is no new Kotlin migration for a CLI application that successfully builds
the published `1.1.3` package. Version `1.1.3` already depends on Mapp Android
SDK 5.1.14 and Kotlin stdlib 2.3.21, and its CLI example already selects Kotlin
2.3.21. An application using only React Native's Kotlin 2.1.20 default is already
incompatible with that published dependency graph.

The React Native peer range is broadened:

| Package implementation | React Native peer range |
| --- | --- |
| Published `1.1.3` on `main` | `>=0.84.0 <0.85.0` |
| Expo-compatible `2.0.0` | `>=0.84.0 <0.86.0` |

The Android build setup changes, but a working CLI consumer should not need to
change versions. The published version declares its own React Native and Kotlin
build dependencies. The new version removes those package-local pins and uses
the compatible versions already supplied by the consuming application so that
it can build with both React Native CLI and Expo-generated projects.

For an application already building version `1.1.3`, this is neither an
application API migration nor a Kotlin migration. Confirm the existing Kotlin
and Android SDK values during the upgrade rather than replacing them. A custom
Gradle project only needs attention if it relied on nonstandard plugin loading.

### What is automatic and what can require action?

| Concern | Handled by the package? | Explanation |
| --- | --- | --- |
| React Native Android dependency | Yes | The library declares versionless `react-android`; the consuming React Native Gradle plugin selects the matching version. |
| React Native codegen and autolinking | Yes | Standard React Native CLI and Expo projects discover and generate the TurboModule integration. |
| Library Android SDK values | Yes, with limits | The library inherits root project SDK values and retains min/compile/target fallbacks of 24/36/36. The application module must still use SDK values compatible with all of its dependencies. |
| Expo Kotlin selection | Yes | The package config plugin runs before Expo generates/builds Android and supplies Kotlin 2.3.20 when the app has not selected a version. |
| CLI Kotlin selection | Inherited without replacement | The package uses the application's compiler. A CLI app that already builds version `1.1.3` should keep its existing compatible Kotlin version. |
| Standard Android Gradle plugins | Yes for standard templates | React Native CLI and Expo templates provide them. Only custom Gradle layouts may need to declare them. |
| iOS autolinking | Yes | CocoaPods discovers the pod after the npm dependency is installed. The user still runs `pod install` and rebuilds. |

The old package appears more self-contained because its library
`android/build.gradle` downloaded specific Android, React Native, and Kotlin
Gradle plugins and pinned `react-android:0.84.1`. That approach can compile the
library with versions different from the application, but it can also introduce
duplicate Gradle plugin classpaths and makes Expo or a newer React Native version
resolve incompatible native dependencies.

The new package removes the React Native pin because the React Native Gradle
plugin manages the Maven dependency. It intentionally does not replace Kotlin
for CLI consumers: the root project selects and loads its Kotlin plugin before
the library is configured. Reintroducing a library-local Kotlin pin would not
reliably override that compiler and can conflict with Expo's compiler plugins.

Consequently, an existing CLI user whose app builds version `1.1.3` has no
source-code or Kotlin migration. Keep the application's current compatible
Kotlin and SDK values. First-time consumers starting from React Native's Kotlin
2.1.20 default must select Kotlin 2.3.x, but that is a requirement of the native
SDK already shipped by version `1.1.3`, not a breaking change introduced by Expo
support.

## Path A: continue using React Native CLI

CLI users do not need to install Expo, add an Expo config plugin, run Expo
Prebuild, change existing tracking code, or replace a compatible Kotlin version.

### 1. Upgrade the package

After version `2.0.0` is published, update the dependency:

```sh
npm install mapp-intelligence-reactnative-plugin@2.0.0
```

or:

```sh
yarn add mapp-intelligence-reactnative-plugin@2.0.0
```

### 2. Keep the existing JavaScript or TypeScript integration

No API rename or signature migration is required. Code such as the following
continues to work:

```ts
import {
  LogLevel,
  MappIntelligencePlugin,
} from 'mapp-intelligence-reactnative-plugin';

await MappIntelligencePlugin.initWithConfiguration(
  [123456789012345],
  'https://tracking.example.com'
);
await MappIntelligencePlugin.setLogLevel(LogLevel.all);
await MappIntelligencePlugin.build();
await MappIntelligencePlugin.trackPage('Home');
```

Replace the example tracking ID and domain with the account values already used
by the application.

### 3. Confirm the Android versions owned by the application

Mapp Android SDK 5.1.14 contains Kotlin 2.3 metadata. The application must make a
compatible Kotlin 2.3 Gradle plugin available. The validated CLI configuration
uses Kotlin 2.3.21, Android min SDK 24, compile SDK 36, target SDK 36, Gradle 9.0,
and Java 21.

A standard React Native root `android/build.gradle` can define these values as
follows:

```gradle
buildscript {
    ext {
        minSdkVersion = 24
        compileSdkVersion = 36
        targetSdkVersion = 36
        kotlinVersion = "2.3.21"
    }

    repositories {
        google()
        mavenCentral()
    }

    dependencies {
        classpath("com.android.tools.build:gradle")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:${kotlinVersion}")
    }
}

apply plugin: "com.facebook.react.rootproject"
```

Keep the Android Gradle Plugin and Gradle wrapper versions supplied by the
application's React Native release. Do not copy Gradle or Android plugin versions
from the library into the application.

If the application already uses compatible Kotlin and SDK values, no Android
configuration change is needed.

### 4. Check custom Android projects

Standard React Native projects already make these plugins available:

- `com.android.library`
- `org.jetbrains.kotlin.android`
- `com.facebook.react`

The library applies those plugins but no longer downloads or pins independent
versions. A custom root Gradle setup must declare them using versions compatible
with its React Native release.

The application should not add a versioned
`com.facebook.react:react-android:0.84.1` dependency for this library. The React
Native Gradle plugin selects the matching `react-android` version.

### 5. Refresh iOS dependencies

There is no iOS source or podspec migration for this change. Reinstall pods so
the native dependency graph reflects the upgraded npm package:

```sh
cd ios
pod install
cd ..
```

Use `bundle exec pod install` when the application manages CocoaPods with a
Gemfile. The supported iOS deployment target is 15.1, and React Native 0.84/0.85
requires Xcode 16.1 or newer.

### 6. Clean and rebuild both native applications

Remove stale Android build output and rebuild:

```sh
cd android
./gradlew clean
cd ..
npx react-native run-android
```

Rebuild iOS after installing pods:

```sh
npx react-native run-ios
```

A Metro reload is insufficient because the package contains native code.

### 7. Verify the CLI application

After the SDK initialization completes, verify module loading and a basic call:

```ts
const initialized = await MappIntelligencePlugin.isInitialized();

if (!initialized) {
  throw new Error('Mapp Intelligence did not initialize');
}

await MappIntelligencePlugin.trackPage('Migration verification');
```

The repository keeps `example/` as the React Native CLI regression application.

## Path B: use the package in an existing Expo application

This path applies when the application already uses Expo SDK 56 and React Native
0.85.3.

### 1. Install the native package and development client

```sh
npx expo install expo-dev-client
npm install mapp-intelligence-reactnative-plugin
```

The package contains native code. Expo Go cannot load it because Expo Go has a
fixed native runtime. Use a development build for local testing.

### 2. Register the package config plugin

Add the plugin to `app.json`:

```json
{
  "expo": {
    "plugins": ["mapp-intelligence-reactnative-plugin"]
  }
}
```

If the application already has plugins, append the package name to the existing
array. Do not replace the other entries.

The package config plugin:

- Preserves an existing `android.kotlinVersion` value.
- Supplies Kotlin 2.3.20 when that property is absent in the validated Expo SDK
  56 setup.
- Connects Expo's generated versionless Kotlin Gradle dependency to that
  property.
- Makes no Android manifest or iOS project changes.

No Mapp Intelligence permissions, manifest entries, `Info.plist` entries, or
manual Xcode files are required by this package.

### 3. Resolve the Expo configuration

```sh
npx expo config --type public
```

Resolve any config-plugin error before generating native projects.

### 4. Regenerate native projects

```sh
npx expo prebuild --clean
```

Expo Prebuild applies the package plugin, then React Native autolinking discovers
the Android module and iOS pod. Generated native directories should not contain
hand-written configuration that would be lost during a clean Prebuild.

### 5. Build a development application

For Android:

```sh
npx expo run:android
```

For iOS:

```sh
npx expo run:ios
```

Then start Metro for the installed development application:

```sh
npx expo start --dev-client
```

### 6. Keep the existing tracking code

Use the same initialization and tracking calls that were used in the CLI
application. The package exposes the same API in an Expo development build.

### 7. Verify the Expo application

Verify that `isInitialized()` resolves to `true`, then await a representative
operation such as `trackPage()`. Test both Android and iOS development builds.

Re-run clean Prebuild and rebuild the native development application after
installing or upgrading the package or changing native Expo configuration.
JavaScript-only application changes need only a Metro reload.

## Path C: convert an existing CLI application to Expo Prebuild/CNG

Converting an application to Expo is broader than upgrading this package. Expo
Prebuild can regenerate the entire `android/` and `ios/` directories, so existing
native application customizations must be represented in app configuration or
config plugins first.

### 1. Choose a supported Expo and React Native pair

The validated target for this package is Expo SDK 56.0.0 with React Native
0.85.3 and React 19.2.3. Do not migrate to a React Native version outside the
package peer range `>=0.84.0 <0.86.0`.

Expo requires its SDK and React Native versions to be compatible. Follow Expo's
[Adopt Prebuild guide](https://docs.expo.dev/guides/adopting-prebuild/) and
[existing React Native app guide](https://docs.expo.dev/bare/installing-expo-modules/)
for the native changes required by the chosen SDK.

### 2. Preserve existing native behavior

Before the first clean Prebuild, inventory changes currently stored in:

- Android manifests, resources, Gradle files, and application classes.
- iOS `Info.plist`, entitlements, capabilities, build settings, and AppDelegate.
- Push notification, deep link, URL scheme, background mode, and permission
  configuration.
- Native files required by other installed SDKs.

Move those settings into `app.json`, `app.config.js`, `app.config.ts`, or app-level
config plugins. The Mapp Intelligence package plugin covers only its Android
Kotlin compatibility change; it cannot preserve unrelated native app edits.

### 3. Adopt Expo modules and the Expo entry point

After aligning the application with React Native 0.85.3, run Expo's automatic
existing-app installer:

```sh
npx install-expo-modules@latest
```

Confirm that the resulting Expo dependency is SDK 56 compatible. If the
automatic installer cannot update a customized project, follow the manual
Android and iOS changes in Expo's existing-app installation guide.

When adopting full Prebuild, update the application entry point to use Expo's
`registerRootComponent`:

```js
import { registerRootComponent } from 'expo';
import App from './src/App';

registerRootComponent(App);
```

Existing navigation and application components can remain unchanged.

Check the Expo and React Native dependency alignment before continuing:

```sh
npx expo-doctor
```

### 4. Install this package and development client

```sh
npx expo install expo-dev-client
npm install mapp-intelligence-reactnative-plugin
```

Add `mapp-intelligence-reactnative-plugin` to the Expo `plugins` array as shown
in Path B.

### 5. Validate configuration before deleting native projects

```sh
npx expo config --type public
```

Commit the working CLI project or keep a migration branch before running clean
Prebuild so native behavior can be compared during the conversion.

### 6. Generate, build, and test both platforms

```sh
npx expo prebuild --clean
npx expo run:android
npx expo run:ios
```

Start the installed development client with:

```sh
npx expo start --dev-client
```

Verify the application's existing native features as well as Mapp Intelligence
initialization and representative tracking calls. Expo documents why third-party
native libraries require a
[development build](https://docs.expo.dev/develop/development-builds/faq/) and
how CNG regenerates native projects in its
[workflow overview](https://docs.expo.dev/workflow/overview/).

## Using Expo tools without adopting Prebuild

An existing CLI application can install Expo modules while continuing to commit
and maintain `android/` and `ios/` manually. In that setup:

- Follow Path A for this package's Android Kotlin and SDK requirements.
- Continue using React Native autolinking and CocoaPods.
- Do not expect `app.plugin.js` to modify native files because config plugins run
  through Expo Prebuild/CNG.
- A development build is still required when using Expo tooling with this native
  package.

Adopt Path C only when the application is ready for its native projects to be
generated from Expo configuration.

## Migration checklist

### Staying on React Native CLI

- [ ] React Native is within `>=0.84.0 <0.86.0`.
- [ ] React satisfies `^19.2.3`.
- [ ] Android uses min SDK 24+, compile SDK 36+, and Kotlin 2.3.x.
- [ ] A custom Gradle setup provides the standard React Native build plugins.
- [ ] CocoaPods were reinstalled for iOS.
- [ ] Android and iOS applications were rebuilt and reinstalled.
- [ ] `isInitialized()` and a representative tracking call succeeded.

### Moving to Expo Prebuild/CNG

- [ ] Expo SDK and React Native versions are compatible; SDK 56/RN 0.85.3 is the
  validated target.
- [ ] Existing native customizations were moved into Expo configuration or
  app-level config plugins.
- [ ] `expo-dev-client` and this package were installed.
- [ ] `mapp-intelligence-reactnative-plugin` was added to the Expo plugins array.
- [ ] `npx expo config --type public` resolves.
- [ ] Repeated clean Prebuilds produce equivalent native projects.
- [ ] Android and iOS development applications build and install.
- [ ] The TurboModule initializes and representative tracking calls succeed.
- [ ] Testing uses the installed development application, not Expo Go.
