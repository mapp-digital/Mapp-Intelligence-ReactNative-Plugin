# mapp-intelligence-reactnative-plugin

The MappIntelligence SDK allows you to track user activities, screen flow and media usage for an App. All data is send to the MappIntelligence tracking system for further analysis.

## Installation

```sh
npm install mapp-intelligence-reactnative-plugin
```

## Usage

```js
import * as MappIntelligencePlugin from 'mapp-intelligence-reactnative-plugin';

const App = () => {
  async function initMappTracking() {
    await MappIntelligence.setAnonymousTracking(false);
    await MappIntelligence.initWithConfiguration(
      [794940687426749],
      'http://tracker-int-01.webtrekk.net'
    );
    await MappIntelligence.setLogLevel(LogLevel.all);
    await MappIntelligence.setBatchSupportEnabled(false);
    await MappIntelligence.setBatchSupportSize(150);
    await MappIntelligence.setRequestInterval(1);
    await MappIntelligence.setRequestPerQueue(300);
    await MappIntelligence.setShouldMigrate(true);
    await MappIntelligence.setSendAppVersionInEveryRequest(true);
    await MappIntelligence.setEnableBackgroundSendout(true);
    await MappIntelligence.setExceptionLogLevel(ExceptionType.all);
    await MappIntelligence.setEnableUserMatching(true);

    await MappIntelligence.build();
  }
};
// ...
```

[Read documentation](https://mapp.atlassian.net/wiki/external/OWE1ZGE0YWIxOTc4NDliOWFhN2EzMzg4MDZkZWY1MTQ)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
