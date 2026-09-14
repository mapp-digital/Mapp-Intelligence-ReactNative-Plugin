# mapp-intelligence-reactnative-plugin

The MappIntelligence SDK allows you to track user activities, screen flow and media usage for an app. All data is send to the MappIntelligence tracking system for further analysis.

## Installation

```sh
npm install mapp-intelligence-reactnative-plugin
```

For React Native CLI, rebuild the native app after installation (and run CocoaPods
installation for iOS). The existing [`example/`](example/) app remains the CLI
regression app.

For Expo, use a native development build. Expo Go does not contain this native
module. A separate [`example-expo/`](example-expo/README.md) app covers Expo
Prebuild and autolinking without converting the CLI example. The current Expo
validation target and remaining release requirements are listed in the
[Android validation report](docs/android-expo-validation.md).

Mapp Android SDK 5.1.14 requires a compiler compatible with Kotlin 2.3 metadata.
For the Expo SDK 56 validation target, add this library to `app.json`:

```json
{
  "expo": {
    "plugins": [
      "mapp-intelligence-reactnative-plugin"
    ]
  }
}
```

Then regenerate and rebuild the native app. The Android config plugin defaults
`android.kotlinVersion` to 2.3.20 if absent and binds the generated versionless
Kotlin buildscript dependency to that property. It preserves existing Kotlin
property values and explicitly versioned dependencies. Apps selecting another
compiler must ensure compatibility with the SDK's Kotlin 2.3 metadata.
An app can set its own version through
[expo-build-properties](https://docs.expo.dev/versions/latest/sdk/build-properties/),
as demonstrated in the Expo example. No manifest or iOS changes are made by this
config plugin.

## Usage

```js
import { MappIntelligencePlugin } from 'mapp-intelligence-reactnative-plugin';

const App = () => {
  const TRACKING_IDS_ARRAY = ... ;
  const TRACKING_DOMAIN = ... ;

  async function initMappTracking() {
    await MappIntelligencePlugin.setAnonymousTracking(false);
    await MappIntelligencePlugin.initWithConfiguration(
      TRACKING_IDS_ARRAY,
      TRACKING_DOMAIN
    );
    await MappIntelligencePlugin.setLogLevel(LogLevel.all);
    await MappIntelligencePlugin.setBatchSupportEnabled(false);
    await MappIntelligencePlugin.setBatchSupportSize(150);
    await MappIntelligencePlugin.setRequestInterval(1);
    await MappIntelligencePlugin.setShouldMigrate(true);
    await MappIntelligencePlugin.setSendAppVersionInEveryRequest(true);
    await MappIntelligencePlugin.setEnableBackgroundSendout(true);
    await MappIntelligencePlugin.setExceptionLogLevel(ExceptionType.all);
    await MappIntelligencePlugin.setEnableUserMatching(true);

    await MappIntelligencePlugin.build();
  }
};
// ...
```

[Read documentation](https://docs.mapp.com/docs/react-native-sdk)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
