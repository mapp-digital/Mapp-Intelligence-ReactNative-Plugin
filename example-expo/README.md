# Expo example

This is the separate Expo CNG test app. Keep `../example/` for React Native CLI
regression testing. Native directories here are generated and ignored by Git.

The validation target is Expo SDK 56.0.0, React Native 0.85.3, React 19.2.3, and
New Architecture. `app.json` uses `expo-build-properties` to select Kotlin 2.3.20,
required by Mapp Android SDK 5.1.14; the default Kotlin 2.1.20 fails compilation.
The library's Android config plugin also binds the generated Kotlin compiler
dependency to the app property; the property override alone is insufficient.
Use a development build; Expo Go cannot load this library.
The completed Android checks are recorded in the
[validation report](../docs/android-expo-validation.md).

## Install and generate Android

From this directory, use npm so this app's React Native version stays independent
of the root Yarn workspaces. `.npmrc` installs the local library as a package copy
instead of a symlink into the CLI app's dependency tree.

```sh
npm install
npm run test:prebuild
npm run build:android -- -PreactNativeArchitectures=arm64-v8a
npm run android
```

`app.json` declares SDK 56 so the literal `expo prebuild --clean` command resolves
the SDK 56 native template. `test:prebuild` runs that clean Android prebuild twice
and compares every generated file. It deletes this app's generated Android
directory; keep native changes in app configuration, not in that directory.

After changing the library, remove only
`node_modules/mapp-intelligence-reactnative-plugin`, reinstall, and rebuild the
native app to refresh the local package copy.

## Runtime smoke test

Open the app in the development client through Metro (`npm start`), then press
**Run smoke test**. With the app loaded, run `npm run test:integration` to automate
that check with Maestro. It requires a connected emulator/device and a running
Metro server.

The test requires the TurboModule, initializes the SDK, checks `isInitialized()`,
and awaits a basic page tracking call. Success displays `MAPP_TRACKING_OK`. The
reserved `example.invalid` domain avoids sending events to a real account; this
checks the native bridge, not server delivery.

For the CLI regression, use the existing commands and integration flow in
`../example/`. iOS prebuild/build can be exercised with `npm run ios`; iOS support
must be validated independently before release.
