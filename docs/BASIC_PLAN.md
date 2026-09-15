# Expo integration plan

Keep the public JavaScript and TypeScript API unchanged. Preserve `example/` as
the React Native CLI regression app and maintain `example-expo/` as a separate
Expo CNG development-build app.

## Phase 1 — Package and API contract

- Record the supported Expo, React Native, React, Kotlin, Android SDK, Gradle,
  Xcode, and iOS deployment targets.
- Verify that Expo support requires no changes to exports or public TypeScript
  signatures.
- Keep React Native CLI autolinking and both native implementations working.

Exit criteria: public API diff is empty and the supported-version matrix is
documented.

## Phase 2 — Expo example parity

- Port the existing CLI example's screens and representative workflows to the
  separate Expo app: configuration, page, action, campaign, ecommerce, media,
  exception, webview, video, fetch, and comprehensive plugin tests.
- Keep dependencies isolated so Expo's React Native version cannot replace the
  CLI example's React Native version.
- Use an Expo development build and retain an automated smoke flow for module
  initialization and representative tracking operations.

Exit criteria: the Expo app exposes the same functional routes as the CLI app and
its JavaScript bundle resolves all screens.

## Phase 3 — Native Expo integration and package artifact

- Keep Android build plugins, React Native, SDK, and Kotlin settings app-owned
  where compatible; retain library fallbacks only where needed.
- Apply package-level Expo config changes only for native configuration required
  during CNG. Do not add manifest changes without a demonstrated requirement.
- Ensure config-plugin entry points and all native package files are included in
  `npm pack` output.
- Confirm iOS CocoaPods autolinking works from a clean Expo prebuild.

Exit criteria: config resolution is idempotent, clean prebuild succeeds for both
platforms, and the publish artifact contains every required entry point.

## Phase 4 — Build and runtime verification

- Build Android and iOS Expo development apps from clean generated projects.
- Run Expo module initialization and representative page, action, ecommerce,
  media, and exception tracking operations.
- Build the existing React Native CLI Android and iOS apps and run its unit and
  integration tests.
- Add executable CI checks where the repository environment supports them;
  document local device/simulator checks and any CI prerequisites.

Exit criteria: all four native development builds pass, both example apps load
the module, representative operations resolve, and repeatable verification is
committed.

## Phase 5 — Installation and release documentation

- Document separate React Native CLI and Expo installation paths, supported
  versions, CocoaPods/prebuild steps, and rebuilding after installation or native
  configuration changes.
- State explicitly that Expo Go is unsupported and an Expo development build is
  required.
- Link the verification commands and results, then prepare the change as a
  backward-compatible release.

Exit criteria: a consumer can install either integration path without consulting
the example source, and the release checklist has no unresolved native gates.

## Current status

- Phase 1: complete. The public `src/` API and iOS native sources have no diff
  from `main`. The validated CLI target is React Native 0.84.1, React 19.2.3,
  Kotlin 2.3.21, Android SDK 24/36, Gradle 9.0, iOS 15.1, and Xcode 16.1+.
  The Expo target is Expo SDK 56.0.0, React Native 0.85.3, React 19.2.3,
  Kotlin 2.3.20, Gradle 9.3.1, iOS 15.1, and Xcode 16.1+. Java 21 is used
  for Android validation.
- Phase 2: complete. `example-expo/` now contains the CLI example's complete
  navigation and tracking suite, including configuration, page, action,
  campaign, ecommerce, media, exception, webview, video, fetch, and integration
  test screens. Its independent dependency tree type-checks, and Metro exports
  both Android and iOS bundles successfully.
- Phase 3: complete. Clean CNG is idempotent across 36 Android and 18 iOS
  files, CocoaPods discovers the TurboModule from the generated iOS project,
  and the npm artifact audit confirms the Expo plugin, Android sources, iOS
  podspec/XCFramework, JavaScript output, and types among 169 published files.
  No Intelligence manifest change is needed. The Expo parity app owns its
  separate Appoxee resource and HTTP test-domain settings.
- Phase 4: implementation and repeatable commands are complete. Android Expo and
  CLI builds/runtime checks pass. Expo iOS prebuild plus CocoaPods autolinking
  and codegen discovery pass, but Expo and CLI native iOS build/runtime checks
  remain a release gate because this host does not have full Xcode.
- Phase 5: documentation work is complete. The root README now separates CLI
  and Expo installation, records the supported/validated matrix and native
  rebuild steps, and states that Expo Go is unsupported. The validation guide
  contains commands for both platforms and both example apps. Release readiness
  still waits on the Phase 4 iOS gate.

Detailed results and the remaining iOS gate are recorded in
[Expo and React Native CLI validation](android-expo-validation.md).
