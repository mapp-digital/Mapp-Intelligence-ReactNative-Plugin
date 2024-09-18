# mapp-intelligence-reactnative-plugin

The MappIntelligence SDK allows you to track user activities, screen flow and media usage for an App. All data is send to the MappIntelligence tracking system for further analysis.

## Installation

```sh
npm install mapp-intelligence-reactnative-plugin
```

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
    await MappIntelligencePlugin.setRequestPerQueue(300);
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

[Read documentation](https://docs.mapp.com/v1/docs/react-native-sdk)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
