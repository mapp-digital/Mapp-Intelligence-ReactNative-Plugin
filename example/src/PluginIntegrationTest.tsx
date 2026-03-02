import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  MappIntelligencePlugin,
  LogLevel,
  type MediaEvent,
} from 'mapp-intelligence-reactnative-plugin';

type TestResult = { success: boolean; error?: string; duration?: number };

export default function PluginIntegrationTest() {
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [running, setRunning] = useState(false);

  const runTest = useCallback(
    async (name: string, fn: () => Promise<unknown>): Promise<TestResult> => {
      const start = Date.now();
      try {
        await fn();
        return { success: true, duration: Date.now() - start };
      } catch (e: unknown) {
        const err = e as Error;
        return {
          success: false,
          error: err?.message || String(e),
          duration: Date.now() - start,
        };
      }
    },
    []
  );

  const runAllTests = useCallback(async () => {
    setRunning(true);
    setResults({});

    const testResults: Record<string, TestResult> = {};

    // Config methods (plugin may already be initialized from App)
    testResults.initWithConfiguration = await runTest(
      'initWithConfiguration',
      () =>
        MappIntelligencePlugin.initWithConfiguration(
          [794940687426749],
          'http://tracker-int-01.webtrekk.net'
        )
    );
    testResults.setLogLevel = await runTest('setLogLevel', () =>
      MappIntelligencePlugin.setLogLevel(LogLevel.all)
    );
    testResults.setBatchSupportEnabled = await runTest(
      'setBatchSupportEnabled',
      () => MappIntelligencePlugin.setBatchSupportEnabled(false)
    );
    testResults.setBatchSupportSize = await runTest(
      'setBatchSupportSize',
      () => MappIntelligencePlugin.setBatchSupportSize(150)
    );
    testResults.setRequestInterval = await runTest('setRequestInterval', () =>
      MappIntelligencePlugin.setRequestInterval(1)
    );
    testResults.setAnonymousTracking = await runTest(
      'setAnonymousTracking',
      () => MappIntelligencePlugin.setAnonymousTracking(false)
    );
    testResults.build = await runTest('build', () =>
      MappIntelligencePlugin.build()
    );

    // Tracking methods - with full params
    testResults.trackPage = await runTest('trackPage', () =>
      MappIntelligencePlugin.trackPage('Integration Test Page')
    );
    testResults.trackCustomPage_full = await runTest(
      'trackCustomPage (full params)',
      () =>
        MappIntelligencePlugin.trackCustomPage(
          'Integration Test Page',
          { params: new Map(), categories: new Map(), searchTerm: '' },
          { parameters: new Map() },
          null,
          null,
          null
        )
    );
    testResults.trackCustomPage_null = await runTest(
      'trackCustomPage (null params)',
      () => MappIntelligencePlugin.trackCustomPage('Test Page')
    );
    testResults.trackPageWithCustomData = await runTest(
      'trackPageWithCustomData',
      () =>
        MappIntelligencePlugin.trackPageWithCustomData(
          'Test Page',
          new Map([['cp1', 'val1']])
        )
    );
    testResults.trackPageWithCustomData_null = await runTest(
      'trackPageWithCustomData (null)',
      () => MappIntelligencePlugin.trackPageWithCustomData('Test Page', null)
    );
    testResults.trackAction_full = await runTest('trackAction (full)', () =>
      MappIntelligencePlugin.trackAction(
        'IntegrationTestAction',
        { customParameters: new Map() },
        null,
        null,
        null,
        null
      )
    );
    testResults.trackAction_null = await runTest(
      'trackAction (null params)',
      () => MappIntelligencePlugin.trackAction('Test Action')
    );
    testResults.trackUrl = await runTest('trackUrl', () =>
      MappIntelligencePlugin.trackUrl('https://example.com', 'code')
    );
    testResults.trackUrl_nullMedia = await runTest(
      'trackUrl (null mediaCode)',
      () => MappIntelligencePlugin.trackUrl('https://example.com')
    );
    testResults.trackMedia = await runTest('trackMedia', () =>
      MappIntelligencePlugin.trackMedia({
        pageName: 'Integration Test',
        parameters: {
          name: 'test',
          action: 'init',
          position: 0,
          duration: 0,
          customCategories: null,
        },
      } as MediaEvent)
    );
    testResults.trackMedia_null = await runTest(
      'trackMedia (null params)',
      () =>
        MappIntelligencePlugin.trackMedia({
          pageName: 'Test',
          parameters: null,
        } as MediaEvent)
    );
    testResults.trackException = await runTest('trackException', () =>
      MappIntelligencePlugin.trackException(
        new Error('Integration test exception'),
        'stack trace'
      )
    );
    testResults.trackExceptionWithName = await runTest(
      'trackExceptionWithName',
      () =>
        MappIntelligencePlugin.trackExceptionWithName(
          'IntegrationTestEx',
          'Test message',
          'stack'
        )
    );

    // Other methods
    testResults.getEverId = await runTest('getEverId', () =>
      MappIntelligencePlugin.getEverId()
    );
    testResults.isInitialized = await runTest('isInitialized', () =>
      MappIntelligencePlugin.isInitialized()
    );
    testResults.printCurrentConfig = await runTest('printCurrentConfig', () =>
      MappIntelligencePlugin.printCurrentConfig()
    );
    testResults.sendRequestsAndClean = await runTest(
      'sendRequestsAndClean',
      () => MappIntelligencePlugin.sendRequestsAndClean()
    );

    setResults(testResults);
    setRunning(false);
  }, [runTest]);

  const passed = Object.values(results).filter((r) => r.success).length;
  const failed = Object.values(results).filter((r) => !r.success).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <TouchableOpacity
          style={[styles.button, running && styles.buttonDisabled]}
          onPress={runAllTests}
          disabled={running}
          testID="run-plugin-tests"
        >
          <Text style={styles.buttonText}>
            {running ? 'Running...' : 'Run All Plugin Tests'}
          </Text>
        </TouchableOpacity>

        {Object.keys(results).length > 0 && (
          <View testID="plugin-test-results">
            <Text style={styles.summary}>
              {passed} passed, {failed} failed
            </Text>
            {Object.entries(results).map(([name, r]) => (
              <View
                key={name}
                style={[styles.row, !r.success && styles.rowFailed]}
              >
                <Text style={styles.rowText}>
                  {r.success ? '✓' : '✗'} {name}
                  {r.duration != null && (
                    <Text style={styles.duration}> ({r.duration}ms)</Text>
                  )}
                </Text>
                {r.error != null && (
                  <Text style={styles.error} numberOfLines={2}>
                    {r.error}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flex: 1,
    padding: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  summary: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  row: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rowFailed: {
    backgroundColor: '#ffebee',
  },
  rowText: {
    fontSize: 14,
  },
  duration: {
    fontSize: 12,
    color: '#666',
  },
  error: {
    color: '#c62828',
    fontSize: 12,
    marginTop: 4,
  },
});
