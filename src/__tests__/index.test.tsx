import {
  MappIntelligencePlugin,
  build,
  initWithConfiguration,
  // setLogLevel,
  // setExceptionLogLevel,
  // setRequestInterval,
  // setBatchSupportEnabled,
  // setEnableBackgroundSendout,
  // setBatchSupportSize,
  // setRequestPerQueue,
  // setShouldMigrate,
  // setAnonymousTracking,
  // setSendAppVersionInEveryRequest,
  // setEnableUserMatching,
  // trackPage,
  // trackCustomPage,
  // trackPageWithCustomData,
  // trackAction,
  // trackUrl,
  // trackMedia,
  // trackException,
  // trackExceptionWithName,
  // setEverId,
  // getEverId,
  // isInitialized,
  // setTemporarySessionId,
  // optOut,
  // optIn,
  // reset,
  // sendRequestsAndClean,
} from '../index';

// Mock the native module
jest.mock('react-native', () => ({
  Platform: {
    select: () => '',
  },
  NativeModules: {
    MappinteligencePlugin: {
      build: jest.fn(),
      initWithConfiguration: jest.fn(),
      setLogLevel: jest.fn(),
      setExceptionLogLevel: jest.fn(),
      setRequestInterval: jest.fn(),
      setBatchSupportEnabled: jest.fn(),
      setEnableBackgroundSendout: jest.fn(),
      setBatchSupportSize: jest.fn(),
      setRequestPerQueue: jest.fn(),
      setShouldMigrate: jest.fn(),
      setAnonymousTracking: jest.fn(),
      setSendAppVersionInEveryRequest: jest.fn(),
      setEnableUserMatching: jest.fn(),
      trackPage: jest.fn(),
      trackCustomPage: jest.fn(),
      trackPageWithCustomData: jest.fn(),
      trackAction: jest.fn(),
      trackUrl: jest.fn(),
      trackMedia: jest.fn(),
      trackException: jest.fn(),
      trackExceptionWithName: jest.fn(),
      setEverId: jest.fn(),
      getEverId: jest.fn(),
      isInitialized: jest.fn(),
      setTemporarySessionId: jest.fn(),
      optOut: jest.fn(),
      optIn: jest.fn(),
      reset: jest.fn(),
      sendRequestsAndClean: jest.fn(),
    },
  },
}));

describe('MappIntelligencePlugin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('build', async () => {
    await build();
    expect(MappIntelligencePlugin.build).toHaveBeenCalled();
  });

  test('initWithConfiguration', async () => {
    const trackIDs = [123, 456];
    const domain = 'https://example.com';
    await initWithConfiguration(trackIDs, domain);
    expect(MappIntelligencePlugin.initWithConfiguration).toHaveBeenCalledWith(
      trackIDs,
      domain
    );
  });

  // Add tests for other methods similarly
});
