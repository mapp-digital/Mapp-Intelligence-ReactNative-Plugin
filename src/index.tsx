import { NativeModules, Platform } from 'react-native';
import type {
  CampaignParameters,
  EcommerceParameters,
  EventParameters,
  ExceptionType,
  MediaEvent,
  MediaParam,
  PageParameters,
  SessionParameters,
  UserCategories,
} from './DataTypes';
import {
  convertCampaignParameters,
  convertEcommerceParameters,
  convertMediaEvent,
  convertPageParameters,
  convertSessionParamters,
  convertUserCategories,
} from './Converters';

const LINKING_ERROR =
  `The package 'react-native-mappinteligence-plugin' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const MappIntelligencePlugin = NativeModules.MappinteligencePlugin
  ? NativeModules.MappinteligencePlugin
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

/**
 * Builds plugin with a provided configuration. After this method finishes, plugin is ready for use.
 * @returns result if method executed succesfully or not
 */
export function build(): Promise<number> {
  console.log('build');
  return MappIntelligencePlugin.build();
}

/**
 * Initialize plugin with a provided trackIds and domain
 * @param trackIDs array of trackIds
 * @param domain tracking domain url
 * @returns result if method executed succesfully or not
 */
export function initWithConfiguration(
  trackIDs: number[],
  domain: string
): Promise<number> {
  console.log('initWithConfiguration');
  return MappIntelligencePlugin.initWithConfiguration(trackIDs, domain);
}

/**
 * Set log level to define what will be logged to the console
 * @param level log level
 * @returns result if method executed succesfully or not
 */
export function setLogLevel(level: number): Promise<number> {
  console.log('setLogLevel');
  return MappIntelligencePlugin.setLogLevel(level);
}

/**
 * Set exception log level
 * @param level one of the predefined exception types
 * @returns result if method executed succesfully or not
 */
export function setExceptionLogLevel(level: ExceptionType): Promise<number> {
  return MappIntelligencePlugin.setExceptionLogLevel(level);
}

/**
 * Sets interval in minutes, for periodic job to execute and send tracked requests to a server
 * @param interval number in minutes. The minimum is 15, limited by Android specification for a worker.
 * @returns result if method executed succesfully or not
 */
export function setRequestInterval(interval: number): Promise<number> {
  console.log('setRequestInterval');
  return MappIntelligencePlugin.setRequestInterval(interval);
}

/**
 * If sets to true, request will be send in a batch (multiple records in single network call);
 * Otherwise records are sent one record by one network call.
 * @param enabled speciffy if batch is enabled or disabled
 * @returns result if method executed succesfully or not
 */
export function setBatchSupportEnabled(enabled: boolean): Promise<number> {
  console.log('setBatchSupportEnabled');
  return MappIntelligencePlugin.setBatchSupportEnabled(enabled);
}

/**
 *
 * @param enabled
 * @returns
 */
export function setEnableBackgroundSendout(enabled: boolean): Promise<number> {
  console.log('setEnableBackgroundSendout');
  return MappIntelligencePlugin.setEnableBackgroundSendout(enabled);
}

export function setBatchSupportSize(size: number): Promise<number> {
  console.log('setBatchSupportSize');
  return MappIntelligencePlugin.setBatchSupportSize(size);
}

export function setRequestPerQueue(numberOfRequsts: number): Promise<number> {
  console.log('setRequestPerQueue');
  return MappIntelligencePlugin.setRequestPerQueue(numberOfRequsts);
}

export function setShouldMigrate(migrate: boolean): Promise<number> {
  console.log('setShouldMigrate');
  return MappIntelligencePlugin.setShouldMigrate(migrate);
}

export function setAnonymousTracking(anonymous: boolean): Promise<number> {
  console.log('setAnonymousTracking');
  return MappIntelligencePlugin.setAnonymousTracking(anonymous);
}

export function setSendAppVersionInEveryRequest(
  flag: boolean
): Promise<number> {
  console.log('setSendAppVersionInEveryRequest');
  return MappIntelligencePlugin.setSendAppVersionInEveryRequest(flag);
}

export function setEnableUserMatching(enabled: boolean): Promise<number> {
  console.log('setEnableUserMatching');
  return MappIntelligencePlugin.setEnableUserMatching(enabled);
}

//TODO: parameterless function??
export function trackPage(pageTitle: string): Promise<number> {
  console.log('trackPage');
  return MappIntelligencePlugin.trackPage(pageTitle);
}

export function trackCustomPage(
  pageTitle: string,
  pageParameters?: PageParameters | null,
  sessionParamters?: SessionParameters | null,
  userCategories?: UserCategories | null,
  ecommerceParameters?: EcommerceParameters | null,
  campaignParameters?: CampaignParameters | null
): Promise<number> {
  console.log('trackCustomPage');
  return MappIntelligencePlugin.trackCustomPage(
    pageTitle,
    convertPageParameters(pageParameters),
    convertSessionParamters(sessionParamters),
    convertUserCategories(userCategories),
    convertEcommerceParameters(ecommerceParameters),
    convertCampaignParameters(campaignParameters)
  );
}

export function trackPageWithCustomData(
  pageTitle: string,
  pageParameters: Map<string, string> | null
): Promise<number> {
  console.log('trackPageWithCustomData');
  const params = pageParameters?.entries();
  const data = params != null ? Object.fromEntries(params) : {};
  return MappIntelligencePlugin.trackPageWithCustomData(data, pageTitle);
}

export function trackAction(
  name: string,
  eventParameters?: EventParameters | null,
  sessionParamters?: SessionParameters | null,
  userCategories?: UserCategories | null,
  ecommerceParameters?: EcommerceParameters | null,
  campaignParameters?: CampaignParameters | null
): Promise<number> {
  console.log('trackAction');
  if (Platform.OS === 'ios') {
    return MappIntelligencePlugin.trackAction(
      name,
      convertEventParameters(eventParameters),
      convertSessionParamters(sessionParamters),
      convertUserCategories(userCategories),
      convertEcommerceParameters(ecommerceParameters),
      convertCampaignParameters(campaignParameters)
    );
  } else {
    return MappIntelligencePlugin.trackAction(
      name,
      eventParameters,
      sessionParamters,
      userCategories,
      ecommerceParameters,
      campaignParameters
    );
  }
}

export function trackUrl(
  url: string,
  mediaCode?: string | null
): Promise<number> {
  return MappIntelligencePlugin.trackUrl(url, mediaCode);
}

export function trackMedia(params: MediaEvent): Promise<number>;

export function trackMedia(
  params: Map<MediaParam, string>,
  mediaName?: string | null,
  pageName?: string | null
): Promise<number>;

export function trackMedia(
  params: Map<MediaParam, string> | MediaEvent,
  mediaName?: string | null,
  pageName?: string | null
): Promise<number> {
  if ('pageName' in params) {
    console.log('Execute MediaEvent');
    return MappIntelligencePlugin.trackMedia(
      convertMediaEvent(params as MediaEvent)
    );
  } else {
    console.log('Execute CustomMediaEvent');
    const cp = params as Map<MediaParam, string>;
    const customParams = cp != null ? Object.fromEntries(cp.entries()) : {};
    const name = mediaName != null ? mediaName : '';
    return MappIntelligencePlugin.trackCustomMedia(
      pageName,
      name,
      customParams
    );
  }
}

export function trackException(
  e: Error,
  stackTrace?: string | null
): Promise<number> {
  return MappIntelligencePlugin.trackException(
    e.name,
    e.message.slice(0, 1000),
    e.stack !== null ? e.stack?.slice(0, 1000) : stackTrace?.slice(0, 1000)
  );
}

export function trackExceptionWithName(
  name: string,
  message: string,
  stackTrace?: string | null
): Promise<number> {
  return MappIntelligencePlugin.trackException(
    name,
    message.slice(0, 1000),
    stackTrace?.slice(0, 1000)
  );
}

export function setEverId(everId?: String | null): Promise<number> {
  console.log('setEverId');
  return MappIntelligencePlugin.setEverId(everId);
}

export function getEverId(): Promise<string> {
  return MappIntelligencePlugin.getEverId();
}

export function isInitialized(): Promise<boolean> {
  return MappIntelligencePlugin.isInitialized();
}

export function setTemporarySessionId(
  sessionId?: String | null
): Promise<number> {
  console.log('setTemporarySessionId');
  return MappIntelligencePlugin.setTemporarySessionId(sessionId);
}

export function optOut(sendData: boolean): Promise<number> {
  return MappIntelligencePlugin.optOut(sendData);
}

export function optIn(sendData: boolean): Promise<number> {
  return MappIntelligencePlugin.optIn(sendData);
}

export function reset(): Promise<number> {
  return MappIntelligencePlugin.reset();
}

export function sendRequestsAndClean(): Promise<number> {
  return MappIntelligencePlugin.sendRequestsAndClean();
}
