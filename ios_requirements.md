# iOS Native Plugin – Required Changes

All notable iOS changes identified during the plugin audit for React Native 0.83 compatibility and correctness.

---

## 1. Podspec – iOS Deployment Target

**File:** `mapp-intelligence-reactnative-plugin.podspec`

| Current | Required |
|---------|----------|
| `s.platforms = { :ios => "11.0" }` | `s.platforms = { :ios => "15.1" }` |

**Reason:** React Native 0.83 uses `min_ios_version_supported` = **15.1** (from `react-native/scripts/cocoapods/helpers.rb`). The example app's Podfile uses `min_ios_version_supported`, and the Xcode project targets 13.4 in `project.pbxproj`. Align the podspec with RN 0.83 requirements.

---

## 2. Deprecated API – `keyWindow`

**File:** `ios/MappinteligencePlugin.mm` (around line 246)

```objc
UIViewController *topController = [UIApplication sharedApplication].keyWindow.rootViewController;
```

**Reason:** `keyWindow` is deprecated in iOS 13+. Use scene-based API for iOS 13+:

```objc
UIWindow *keyWindow = nil;
if (@available(iOS 13.0, *)) {
    for (UIWindowScene *scene in [UIApplication sharedApplication].connectedScenes) {
        if (scene.activationState == UISceneActivationStateForegroundActive) {
            keyWindow = scene.windows.firstObject;
            break;
        }
    }
}
if (!keyWindow) keyWindow = [UIApplication sharedApplication].keyWindow;
UIViewController *topController = keyWindow.rootViewController;
```

---

## 3. Bug – `setRequestInterval` Ignores Parameter

**File:** `ios/MappinteligencePlugin.mm` (lines 151–156)

```objc
RCT_EXPORT_METHOD(setRequestInterval:(NSInteger)interval ...)
{
    [[MappIntelligence shared] setRequestInterval:60];  // ❌ Always 60, ignores `interval`
```

**Fix:** Replace with:

```objc
[[MappIntelligence shared] setRequestInterval:interval];
```

---

## 4. Typo – `trackPage` Parameter Name

**File:** `ios/MappinteligencePlugin.mm` (line 242)

```objc
reslove:(RCTPromiseResolveBlock)resolve   // ❌ Typo
```

**Fix:** Change to `resolve:`.

---

## 5. Nullable Parameters

**`setTemporarySessionId`** (line 37) – `sessionId` can be `nil` from JS when optional. Current `[[MappIntelligence shared] setTemporarySessionId:sessionId]` may need nil guard depending on Mapp SDK API.

**`setEverId`** (line 52) – Spec has `setEverId(everId?: string)`. When `everId` is `nil`, `initWithConfiguration:... andWithEverID:everId` may crash. Verify Mapp SDK accepts nil/empty and add nil handling if needed.

**`trackUrl` mediaCode** (line 331) – Spec has `mediaCode?: string` (optional). When nil, `withMediaCode:mediaCode` – verify Mapp SDK handles nil; add nil guard if required.

---

## 6. MappIntelligence SDK Version

**File:** `mapp-intelligence-reactnative-plugin.podspec`

| Platform | Current Version |
|----------|-----------------|
| iOS | `MappIntelligence` 5.0.15 |
| Android | `intelligence-android` 5.1.13 |

**Action:** Check CocoaPods/Mapp documentation for a newer iOS SDK release; align with Android if a compatible version exists.

---

## 7. `trackPage` with Nil `pageTitle`

**File:** `ios/MappinteligencePlugin.mm` (lines 241–259)

When `pageTitle` is nil/empty, the `if(pageTitle)` branch uses `trackPageWithViewController:topController pageViewEvent:NULL`. If `keyWindow` is nil, `topController` can be nil and may crash. Add nil checks for `topController` before use.

---

## 8. `trackMedia` Possible Crash

**File:** `ios/MappinteligencePlugin.mm` (lines 372–375)

```objc
MIMediaParameters* mParameters = [self prepareMediaParameters:mp[@"parameters"]];
MIMediaEvent* mediaEvent = [[MIMediaEvent alloc] initWithPageName:mediaEventDictionary[@"parameters"][@"name"] ...
```

**Risk:** If `mediaEventDictionary[@"parameters"]` is nil, `mp[@"parameters"]` and `mediaEventDictionary[@"parameters"][@"name"]` will crash.

**Fix:** Add nil checks before accessing nested keys.

---

## Summary Table

| Priority | Category | Change |
|----------|----------|--------|
| High | Podspec | iOS platform 11.0 → 15.1 |
| High | Bug | `setRequestInterval` – use `interval` param instead of hardcoded 60 |
| High | Crash risk | `trackMedia` – add nil guard for `parameters` |
| Medium | Deprecated API | Replace `keyWindow` with scene-based API |
| Medium | Typo | `reslove` → `resolve` in `trackPage` |
| Medium | Nullable params | Verify `setEverId`, `setTemporarySessionId`, `trackUrl` handle nil |
| Low | SDK version | Check for newer MappIntelligence iOS SDK to align with Android |

---

## Optional: New Architecture Testing

The example app Podfile has `:fabric_enabled => false`. To verify TurboModule compatibility on iOS, consider enabling Fabric and running the example. The current implementation supports both legacy and New Architecture; no code changes required for testing.
