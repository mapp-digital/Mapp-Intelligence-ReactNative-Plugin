import { ExceptionType, type MediaEvent } from '../DataTypes';
import {
  MappIntelligencePlugin,
  build,
  initWithConfiguration,
  setLogLevel,
  setExceptionLogLevel,
  setRequestInterval,
  setBatchSupportEnabled,
  setEnableBackgroundSendout,
  setBatchSupportSize,
  setRequestPerQueue,
  setAnonymousTracking,
  setSendAppVersionInEveryRequest,
  // setEnableUserMatching,
  trackPage,
  trackCustomPage,
  trackPageWithCustomData,
  trackAction,
  trackUrl,
  trackMedia,
  trackException,
  trackExceptionWithName,
  setEverId,
  getEverId,
  isInitialized,
  setTemporarySessionId,
  optOut,
  optIn,
  reset,
  sendRequestsAndClean,
} from '../index';

// Mock the native module
jest.mock('react-native', () => ({
  Platform: {
    select: () => '',
  },
  NativeModules: {
    MappinteligencePlugin: {
      build: jest.fn(),
      initWithConfiguration: jest.fn((ids, domain) => {
        console.log(ids, domain);
        return true;
      }),
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
  afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks();
  });

  it('build method is called', async () => {
    await build();
    expect(MappIntelligencePlugin.build).toHaveBeenCalled();
  });

  it('init with configuration to return success result and to native method is called', async () => {
    const trackIDs = [123, 456];
    const domain = 'https://example.com';
    const result = await initWithConfiguration(trackIDs, domain);
    expect(result).toBe(true);
    expect(MappIntelligencePlugin.initWithConfiguration).toHaveBeenCalledWith(
      trackIDs,
      domain
    );
  });

  it('set log level for console output', async () => {
    await setLogLevel(1);
    expect(MappIntelligencePlugin.setLogLevel).toBeCalledWith(1);
  });

  it('set exception log level', async () => {
    await setExceptionLogLevel(ExceptionType.all);
    expect(MappIntelligencePlugin.setExceptionLogLevel).toBeCalledWith(4); // 4 is numeric value for ExceptionType.all
  });

  it('set request interval', async () => {
    await setRequestInterval(15);
    expect(MappIntelligencePlugin.setRequestInterval).toBeCalledWith(15);
  });

  it('set batch support', async () => {
    await setBatchSupportEnabled(true);
    expect(MappIntelligencePlugin.setBatchSupportEnabled).toBeCalledWith(true);
  });

  it('set enable background sendout', async () => {
    await setEnableBackgroundSendout(true);
    expect(MappIntelligencePlugin.setEnableBackgroundSendout).toBeCalledWith(
      true
    );
  });

  it('set batch size', async () => {
    await setBatchSupportSize(100);
    expect(MappIntelligencePlugin.setBatchSupportSize).toBeCalledWith(100);
  });

  it('set request per queue', async () => {
    await setRequestPerQueue(10);
    expect(MappIntelligencePlugin.setRequestPerQueue).toBeCalledWith(10);
  });

  it('set request interval', async () => {
    await setRequestInterval(15);
    expect(MappIntelligencePlugin.setRequestInterval).toBeCalledWith(15);
  });

  it('set anonymous tracking', async () => {
    await setAnonymousTracking(true);
    expect(MappIntelligencePlugin.setAnonymousTracking).toBeCalledWith(true);
  });

  it('set send app version in every request', async () => {
    await setSendAppVersionInEveryRequest(true);
    expect(
      MappIntelligencePlugin.setSendAppVersionInEveryRequest
    ).toBeCalledWith(true);
  });

  it('track page', async () => {
    await trackPage('Test page');
    expect(MappIntelligencePlugin.trackPage).toBeCalledWith('Test page');
  });

  it('track custom page', async () => {
    await trackCustomPage('Test page');
    expect(MappIntelligencePlugin.trackCustomPage).toBeCalledWith(
      'Test page',
      null,
      null,
      null,
      null,
      null
    );
  });

  it('track page with a custom data', async () => {
    const pageParams: Map<string, string> = new Map([['1', 'PageParam1']]);
    await trackPageWithCustomData('Test page', pageParams);
    expect(MappIntelligencePlugin.trackPageWithCustomData).toBeCalledWith(
      { '1': 'PageParam1' },
      'Test page'
    );
  });

  it('track action', async () => {
    await trackAction('Test Action');
    expect(MappIntelligencePlugin.trackAction).toBeCalledWith(
      'Test Action',
      null,
      null,
      null,
      null,
      null
    );
  });

  it('track url', async () => {
    await trackUrl('www.testurl.com', 'abc');
    expect(MappIntelligencePlugin.trackUrl).toBeCalledWith(
      'www.testurl.com',
      'abc'
    );
  });

  it('track media', async () => {
    const mediaEvent: MediaEvent = {
      pageName: 'Test page',
      parameters: null,
    };
    await trackMedia(mediaEvent);
    expect(MappIntelligencePlugin.trackMedia).toBeCalledWith({
      pageName: 'Test page',
      parameters: null,
      customParameters: null,
      eCommerceParameters: null,
      eventParameters: null,
      sessionParameters: null,
    });
  });

  it('track exception', async () => {
    const e: Error = {
      name: 'CustomException',
      message: 'Testing Exception',
    };

    await trackException(e, '');
    expect(MappIntelligencePlugin.trackException).toBeCalledWith(
      'CustomException',
      'Testing Exception',
      ''
    );
  });

  it('track exception with name', async () => {
    await trackExceptionWithName(
      'TestException',
      'Handled test exception',
      'Exception in a unit testing'
    );

    expect(MappIntelligencePlugin.trackException).toBeCalledWith(
      'TestException',
      'Handled test exception',
      'Exception in a unit testing'
    );
  });

  it('set EverID', async () => {
    await setEverId('123456789');
    expect(MappIntelligencePlugin.setEverId).toBeCalledWith('123456789');
  });

  it('get EverID', async () => {
    const getEverIdSpy = jest.fn(getEverId);
    getEverIdSpy.mockResolvedValue('123456');
    const result = await getEverIdSpy();
    expect(result).toBe('123456');
  });

  it('Check if plugin initialized', async () => {
    const isInitializedSpy = jest.fn(isInitialized);
    isInitializedSpy.mockResolvedValue(true);
    const result = await isInitializedSpy();
    expect(result).toBe(true);
  });

  it('Set temporarySessionId', async () => {
    const spy = jest.fn(setTemporarySessionId);
    spy.mockResolvedValue(1);

    const result = await spy('1234');
    expect(result).toBe(1);
    expect(spy).toBeCalledWith('1234');
  });

  it('Opt out', async () => {
    const spy = jest.fn(optOut).mockResolvedValue(1);
    const result = await spy(true);
    expect(result).toBe(1);
    expect(spy).toBeCalledWith(true);
  });

  it('Opt in', async () => {
    const spy = jest.fn(optIn).mockResolvedValue(1);
    const result = await spy(true);
    expect(result).toBe(1);
    expect(spy).toBeCalledWith(true);
  });

  it('Reset', async () => {
    await reset();
    expect(MappIntelligencePlugin.reset).toBeCalled();
  });

  it('Send requests and clean', async () => {
    await sendRequestsAndClean();
    expect(MappIntelligencePlugin.sendRequestsAndClean).toBeCalled();
  });
});
