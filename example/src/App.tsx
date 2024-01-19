import * as React from 'react';

import { StyleSheet, View, Text, Button, type GestureResponderEvent } from 'react-native';
import * as MappIntelligence from 'react-native-mappinteligence-plugin';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    MappIntelligence. multiply(3, 7).then(setResult);
  }, []);

  function onPressLearnMore(): void {
    MappIntelligence.setAnonymousTracking(false);
    MappIntelligence.initWithConfiguration([794940687426749], "http://tracker-int-01.webtrekk.net").then(setResult);
    MappIntelligence.setLogLevel(1);
    MappIntelligence.setBatchSupportEnabled(false);
    MappIntelligence.setBatchSupportSize(150);
    MappIntelligence.setRequestInterval(1);
    MappIntelligence.setRequestPerQueue(300);
    MappIntelligence.setShouldMigrate(true);
    MappIntelligence.setSendAppVersionInEveryRequest(true);
    MappIntelligence.setEnableBackgroundSendout(true);
    MappIntelligence.setEnableUserMatching(false);
  }

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
      <Button
        onPress={onPressLearnMore}
        title="Init MappIntelligence"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
