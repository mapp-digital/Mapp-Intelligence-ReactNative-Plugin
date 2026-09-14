Small plan
1. Define the supported Expo SDK/React Native matrix and use Expo development builds, since the plugin contains native code and cannot run in Expo Go.
2. Make Android and iOS independently compatible with Expo Prebuild/autolinking while preserving standard React Native CLI integration.
3. Keep the existing `example/` app for React Native CLI testing; do not replace or convert it to Expo. Add a separate Expo CNG example app for Expo testing. Validate native builds, module loading, and basic tracking in both apps, with additional clean-prebuild and idempotency checks in the Expo app.
4. Document CLI and Expo installation paths and release the change as backward-compatible.

Implementation status
- Existing `example/` is preserved for CLI testing; separate `example-expo/` now contains an Expo development app, native smoke test, Maestro flow, and repeated-prebuild regression check.
- Android configuration inheritance, codegen changes, and the required Android Expo Kotlin config plugin are implemented. CLI APK build/runtime integration and Expo clean-prebuild/idempotency checks have passed.
- Android validation now covers React Native CLI 0.84.1 and Expo SDK 56.0.0 / React Native 0.85.3 with app-configured Kotlin 2.3.20. The package peer range includes React Native 0.84 and 0.85.
- Android ticket checks are complete. Remaining broader plan work: validate iOS independently and prepare the backward-compatible release.
- Detailed acceptance results: [Android Expo validation](android-expo-validation.md).
