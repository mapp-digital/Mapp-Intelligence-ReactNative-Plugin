import React, { useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TurboModuleRegistry,
  View,
} from 'react-native';
import { MappIntelligencePlugin } from 'mapp-intelligence-reactnative-plugin';

export default function App() {
  const [status, setStatus] = useState('Ready');
  const [running, setRunning] = useState(false);

  async function runSmokeTest() {
    setRunning(true);
    setStatus('Running');
    try {
      TurboModuleRegistry.getEnforcing('MappinteligencePlugin');
      await MappIntelligencePlugin.initWithConfiguration(
        [123456789012345],
        'https://example.invalid'
      );
      await MappIntelligencePlugin.build();
      if (!(await MappIntelligencePlugin.isInitialized())) {
        throw new Error('SDK did not initialize');
      }
      const result = await MappIntelligencePlugin.trackPage('Expo smoke test');
      if (result === false || result == null) {
        throw new Error('Tracking call failed');
      }
      setStatus('MAPP_TRACKING_OK');
    } catch (error) {
      setStatus(`FAIL: ${error.message}`);
    } finally {
      setRunning(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapp Expo smoke test</Text>
      <Text>
        Checks native module loading, initialization, and a page call.
      </Text>
      <Text>Uses an invalid test domain; no server delivery is expected.</Text>
      <Button
        title="Run smoke test"
        testID="run-smoke-test"
        disabled={running}
        onPress={runSmokeTest}
      />
      <Text testID="smoke-test-result">{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, marginVertical: 24 },
});
