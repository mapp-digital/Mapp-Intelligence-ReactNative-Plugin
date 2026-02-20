import { ExceptionType, type MediaEvent } from '../DataTypes';
import { MappIntelligencePlugin } from '../MappIntelligencePlugin';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { NativeModules } from 'react-native';

jest.mock('react-native', () => {
  const { jest: jestFn } = require('@jest/globals');
  const mockModule = {
    build: jestFn.fn().mockResolvedValue(1),
    initWithConfiguration: jestFn.fn().mockResolvedValue(1),
    setLogLevel: jestFn.fn().mockResolvedValue(1),
    setExceptionLogLevel: jestFn.fn().mockResolvedValue(1),
    setRequestInterval: jestFn.fn().mockResolvedValue(1),
    setBatchSupportEnabled: jestFn.fn().mockResolvedValue(1),
    setEnableBackgroundSendout: jestFn.fn().mockResolvedValue(1),
    setBatchSupportSize: jestFn.fn().mockResolvedValue(1),
    setRequestPerQueue: jestFn.fn().mockResolvedValue(1),
    setShouldMigrate: jestFn.fn().mockResolvedValue(1),
    setAnonymousTracking: jestFn.fn().mockResolvedValue(1),
    setSendAppVersionInEveryRequest: jestFn.fn().mockResolvedValue(1),
    setEnableUserMatching: jestFn.fn().mockResolvedValue(1),
    trackPage: jestFn.fn().mockResolvedValue(1),
    trackCustomPage: jestFn.fn().mockResolvedValue(1),
    trackPageWithCustomData: jestFn.fn().mockResolvedValue(1),
    trackAction: jestFn.fn().mockResolvedValue(1),
    trackUrl: jestFn.fn().mockResolvedValue(1),
    trackMedia: jestFn.fn().mockResolvedValue(1),
    trackException: jestFn.fn().mockResolvedValue(1),
    trackExceptionWithName: jestFn.fn().mockResolvedValue(1),
    setEverId: jestFn.fn().mockResolvedValue(1),
    getEverId: jestFn.fn().mockResolvedValue('123456'),
    isInitialized: jestFn.fn().mockResolvedValue(true),
    setTemporarySessionId: jestFn.fn().mockResolvedValue(1),
    optOut: jestFn.fn().mockResolvedValue(1),
    optIn: jestFn.fn().mockResolvedValue(1),
    reset: jestFn.fn().mockResolvedValue(1),
    sendRequestsAndClean: jestFn.fn().mockResolvedValue(1),
    getCurrentConfig: jestFn.fn().mockResolvedValue(''),
    nativeCrash: jestFn.fn().mockResolvedValue(undefined),
  };
  return {
    Platform: { select: () => '' },
    NativeModules: {
      MappinteligencePlugin: mockModule,
      MappintelligencePlugin: mockModule,
    },
    TurboModuleRegistry: { get: () => null },
  };
});

const mockNativeModule = NativeModules.MappinteligencePlugin as jest.Mocked<
  typeof NativeModules.MappinteligencePlugin
>;

describe('MappIntelligencePlugin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('build calls native method', async () => {
    await MappIntelligencePlugin.build();
    expect(mockNativeModule.build).toHaveBeenCalled();
  });

  it('initWithConfiguration calls native method with trackIDs and domain', async () => {
    const trackIDs = [123, 456];
    const domain = 'https://example.com';
    const result = await MappIntelligencePlugin.initWithConfiguration(
      trackIDs,
      domain
    );
    expect(result).toBe(1);
    expect(mockNativeModule.initWithConfiguration).toHaveBeenCalledWith(
      trackIDs,
      domain
    );
  });

  it('setLogLevel calls native method with level', async () => {
    await MappIntelligencePlugin.setLogLevel(1);
    expect(mockNativeModule.setLogLevel).toHaveBeenCalledWith(1);
  });

  it('setExceptionLogLevel calls native method with ExceptionType value', async () => {
    await MappIntelligencePlugin.setExceptionLogLevel(ExceptionType.all);
    expect(mockNativeModule.setExceptionLogLevel).toHaveBeenCalledWith(4);
  });

  it('setRequestInterval calls native method', async () => {
    await MappIntelligencePlugin.setRequestInterval(15);
    expect(mockNativeModule.setRequestInterval).toHaveBeenCalledWith(15);
  });

  it('setBatchSupportEnabled calls native method', async () => {
    await MappIntelligencePlugin.setBatchSupportEnabled(true);
    expect(mockNativeModule.setBatchSupportEnabled).toHaveBeenCalledWith(true);
  });

  it('setEnableBackgroundSendout calls native method', async () => {
    await MappIntelligencePlugin.setEnableBackgroundSendout(true);
    expect(mockNativeModule.setEnableBackgroundSendout).toHaveBeenCalledWith(
      true
    );
  });

  it('setBatchSupportSize calls native method', async () => {
    await MappIntelligencePlugin.setBatchSupportSize(100);
    expect(mockNativeModule.setBatchSupportSize).toHaveBeenCalledWith(100);
  });

  it('setRequestPerQueue calls native method', async () => {
    await MappIntelligencePlugin.setRequestPerQueue(10);
    expect(mockNativeModule.setRequestPerQueue).toHaveBeenCalledWith(10);
  });

  it('setShouldMigrate calls native method', async () => {
    await MappIntelligencePlugin.setShouldMigrate(false);
    expect(mockNativeModule.setShouldMigrate).toHaveBeenCalledWith(false);
  });

  it('setAnonymousTracking calls native method', async () => {
    await MappIntelligencePlugin.setAnonymousTracking(true);
    expect(mockNativeModule.setAnonymousTracking).toHaveBeenCalledWith(true);
  });

  it('setSendAppVersionInEveryRequest calls native method', async () => {
    await MappIntelligencePlugin.setSendAppVersionInEveryRequest(true);
    expect(
      mockNativeModule.setSendAppVersionInEveryRequest
    ).toHaveBeenCalledWith(true);
  });

  it('trackPage calls native method with page title', async () => {
    await MappIntelligencePlugin.trackPage('Test page');
    expect(mockNativeModule.trackPage).toHaveBeenCalledWith('Test page');
  });

  it('trackCustomPage calls native method with pageTitle and null params', async () => {
    await MappIntelligencePlugin.trackCustomPage('Test page');
    expect(mockNativeModule.trackCustomPage).toHaveBeenCalledWith(
      'Test page',
      null,
      null,
      null,
      null,
      null
    );
  });

  it('trackPageWithCustomData calls native method with pageParams and pageTitle', async () => {
    const pageParams = new Map<string, string>([['1', 'PageParam1']]);
    await MappIntelligencePlugin.trackPageWithCustomData('Test page', pageParams);
    expect(mockNativeModule.trackPageWithCustomData).toHaveBeenCalledWith(
      pageParams,
      'Test page'
    );
  });

  it('trackAction calls native method with name and null params', async () => {
    await MappIntelligencePlugin.trackAction('Test Action');
    expect(mockNativeModule.trackAction).toHaveBeenCalledWith(
      'Test Action',
      null,
      null,
      null,
      null,
      null
    );
  });

  it('trackUrl calls native method with url and mediaCode', async () => {
    await MappIntelligencePlugin.trackUrl('www.testurl.com', 'abc');
    expect(mockNativeModule.trackUrl).toHaveBeenCalledWith(
      'www.testurl.com',
      'abc'
    );
  });

  it('trackUrl calls native with undefined mediaCode when omitted', async () => {
    await MappIntelligencePlugin.trackUrl('www.testurl.com');
    expect(mockNativeModule.trackUrl).toHaveBeenCalledWith(
      'www.testurl.com',
      undefined
    );
  });

  it('trackMedia calls native method with converted mediaEvent', async () => {
    const mediaEvent: MediaEvent = {
      pageName: 'Test page',
      parameters: null,
    };
    await MappIntelligencePlugin.trackMedia(mediaEvent);
    expect(mockNativeModule.trackMedia).toHaveBeenCalledWith(
      expect.objectContaining({
        pageName: 'Test page',
        parameters: null,
      })
    );
  });

  it('trackException calls native method with error name, message and stackTrace', async () => {
    const e: Error = {
      name: 'CustomException',
      message: 'Testing Exception',
    };
    await MappIntelligencePlugin.trackException(e, '');
    expect(mockNativeModule.trackException).toHaveBeenCalledWith(
      'CustomException',
      'Testing Exception',
      ''
    );
  });

  it('trackExceptionWithName calls native method', async () => {
    await MappIntelligencePlugin.trackExceptionWithName(
      'TestException',
      'Handled test exception',
      'Exception in a unit testing'
    );
    expect(mockNativeModule.trackExceptionWithName).toHaveBeenCalledWith(
      'TestException',
      'Handled test exception',
      'Exception in a unit testing'
    );
  });

  it('setEverId calls native method', async () => {
    await MappIntelligencePlugin.setEverId('123456789');
    expect(mockNativeModule.setEverId).toHaveBeenCalledWith('123456789');
  });

  it('getEverId returns value from native', async () => {
    const result = await MappIntelligencePlugin.getEverId();
    expect(result).toBe('123456');
    expect(mockNativeModule.getEverId).toHaveBeenCalled();
  });

  it('isInitialized returns value from native', async () => {
    const result = await MappIntelligencePlugin.isInitialized();
    expect(result).toBe(true);
    expect(mockNativeModule.isInitialized).toHaveBeenCalled();
  });

  it('setTemporarySessionId calls native method', async () => {
    const result = await MappIntelligencePlugin.setTemporarySessionId('1234');
    expect(result).toBe(1);
    expect(mockNativeModule.setTemporarySessionId).toHaveBeenCalledWith('1234');
  });

  it('optOut calls native method', async () => {
    const result = await MappIntelligencePlugin.optOut(true);
    expect(result).toBe(1);
    expect(mockNativeModule.optOut).toHaveBeenCalledWith(true);
  });

  it('optIn calls native method', async () => {
    const result = await MappIntelligencePlugin.optIn(true);
    expect(result).toBe(1);
    expect(mockNativeModule.optIn).toHaveBeenCalledWith(true);
  });

  it('reset calls native method', async () => {
    await MappIntelligencePlugin.reset();
    expect(mockNativeModule.reset).toHaveBeenCalled();
  });

  it('sendRequestsAndClean calls native method', async () => {
    await MappIntelligencePlugin.sendRequestsAndClean();
    expect(mockNativeModule.sendRequestsAndClean).toHaveBeenCalled();
  });

  it('printCurrentConfig calls native getCurrentConfig', async () => {
    mockNativeModule.getCurrentConfig.mockResolvedValue('config: {...}');
    const result = await MappIntelligencePlugin.printCurrentConfig();
    expect(result).toBe('config: {...}');
    expect(mockNativeModule.getCurrentConfig).toHaveBeenCalled();
  });
});
