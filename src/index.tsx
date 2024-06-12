import { NativeModules, Platform } from 'react-native';
import type {
  CampaignParameters,
  EcommerceParameters,
  EventParameters,
  ExceptionType,
  LogLevel,
  MediaEvent,
  PageParameters,
  SessionParameters,
  UserCategories,
} from './DataTypes';
import {
  convertCampaignParameters,
  convertEcommerceParameters,
  convertEventParameters,
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

export const MappIntelligencePlugin = NativeModules.MappinteligencePlugin
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
export const build = (): Promise<number> => {
  console.log('build');
  return MappIntelligencePlugin.build();
};

/**
 * Initialize plugin with a provided trackIds and domain
 * @param trackIDs array of trackIds
 * @param domain tracking domain url
 * @returns result if method executed succesfully or not
 */
export const initWithConfiguration = (
  trackIDs: number[],
  domain: string
): Promise<number> => {
  console.log('initWithConfiguration');
  return MappIntelligencePlugin.initWithConfiguration(trackIDs, domain);
};

/**
 * Set log level to define what will be logged to the console
 * @param level log level
 * @returns result if method executed succesfully or not
 */
export const setLogLevel = (level: LogLevel): Promise<number> => {
  console.log('setLogLevel - ' + level.valueOf());
  return MappIntelligencePlugin.setLogLevel(level.valueOf());
};

/**
 * Set exception log level
 * @param level one of the predefined exception types
 * @returns result if method executed succesfully or not
 */
export const setExceptionLogLevel = (level: ExceptionType): Promise<number> => {
  return MappIntelligencePlugin.setExceptionLogLevel(level);
};

/**
 * Sets interval in minutes, for periodic job to execute and send tracked requests to a server
 * @param interval number in minutes. The minimum is 15, limited by Android specification for a worker.
 * @returns result if method executed succesfully or not
 */
export const setRequestInterval = (interval: number): Promise<number> => {
  console.log('setRequestInterval');
  return MappIntelligencePlugin.setRequestInterval(interval);
};

/**
 * If sets to true, request will be send in a batch (multiple records in single network call);
 * Otherwise records are sent one record by one network call.
 * @param enabled speciffy if batch is enabled or disabled
 * @returns result if method executed succesfully or not
 */
export const setBatchSupportEnabled = (enabled: boolean): Promise<number> => {
  console.log('setBatchSupportEnabled');
  return MappIntelligencePlugin.setBatchSupportEnabled(enabled);
};

/**
 * iOS Only - Enable sending data while application is in a background state
 * @param enabled
 * @returns result if method executed succesfully or not
 */
export const setEnableBackgroundSendout = (
  enabled: boolean
): Promise<number> => {
  console.log('setEnableBackgroundSendout');
  return MappIntelligencePlugin.setEnableBackgroundSendout(enabled);
};

/**
 * Set number of track records to send in a sigle batch request
 * @param size number of track records
 * @returns result if method executed succesfully or not
 */
export const setBatchSupportSize = (size: number): Promise<number> => {
  console.log('setBatchSupportSize');
  return MappIntelligencePlugin.setBatchSupportSize(size);
};

/**
 * Requests are buffered in a queue before sending. This option set size of the queue.
 * @param numberOfRequsts size of a queue for buffering requests
 * @returns result if method executed succesfully or not
 */
export const setRequestPerQueue = (
  numberOfRequsts: number
): Promise<number> => {
  console.log('setRequestPerQueue');
  return MappIntelligencePlugin.setRequestPerQueue(numberOfRequsts);
};

/**
 * Control if migration should be applied from a previos SDK version.
 * @param migrate true to apply migration on the initialization process; otherwise false
 * @returns result if method executed succesfully or not
 */
export const setShouldMigrate = (migrate: boolean): Promise<number> => {
  console.log('setShouldMigrate');
  return MappIntelligencePlugin.setShouldMigrate(migrate);
};

/**
 * Based on the result of the user's conset to allow personalized tracking or not,
 * enable anonymous tracking when no consent. If enabled, everId will be deleted (and not generated until anonymous tracking is enabled)
 * @param anonymous true to enable anonymous tracking; false to disable it.
 * @returns result if method executed succesfully or not
 */
export const setAnonymousTracking = (anonymous: boolean): Promise<number> => {
  console.log('setAnonymousTracking');
  return MappIntelligencePlugin.setAnonymousTracking(anonymous);
};

/**
 * Send application version as parameter in every request
 * @param flag - true to set sending application version in every request; otherwise false.
 * @returns result if method executed succesfully or not
 */
export const setSendAppVersionInEveryRequest = (
  flag: boolean
): Promise<number> => {
  console.log('setSendAppVersionInEveryRequest');
  return MappIntelligencePlugin.setSendAppVersionInEveryRequest(flag);
};

/**
 * To enable user matching between Engage and Intelligence system
 * @param enabled true to enable user matching; false to disable it.
 * @returns result if method executed succesfully or not
 */
export const setEnableUserMatching = (enabled: boolean): Promise<number> => {
  console.log('setEnableUserMatching');
  return MappIntelligencePlugin.setEnableUserMatching(enabled);
};

/**
 * Track single page by page name
 * @param pageTitle page name for tracking
 * @returns result if method executed succesfully or not
 */
export const trackPage = (pageTitle: string): Promise<number> => {
  console.log('trackPage');
  return MappIntelligencePlugin.trackPage(pageTitle);
};

/**
 * Detailed page tracking with additional parameters that can be set to track
 * @param pageTitle - name of the page
 * @param pageParameters - parameters for the page
 * @param sessionParamters - parameters for the current session
 * @param userCategories - predefined user categories
 * @param ecommerceParameters - predefined eCommerce parameters
 * @param campaignParameters - predefined campaign parameters
 * @returns result if method executed succesfully or not
 */
export const trackCustomPage = (
  pageTitle: string,
  pageParameters?: PageParameters | null,
  sessionParamters?: SessionParameters | null,
  userCategories?: UserCategories | null,
  ecommerceParameters?: EcommerceParameters | null,
  campaignParameters?: CampaignParameters | null
): Promise<number> => {
  console.log('trackCustomPage');
  return MappIntelligencePlugin.trackCustomPage(
    pageTitle,
    convertPageParameters(pageParameters),
    convertSessionParamters(sessionParamters),
    convertUserCategories(userCategories),
    convertEcommerceParameters(ecommerceParameters),
    convertCampaignParameters(campaignParameters)
  );
};

/**
 * Custom page tracking with option to track some custom parameters
 * @param pageTitle - name of the page
 * @param pageParameters - custom parameters that can be tracked
 * @returns result if method executed succesfully or not
 */
export const trackPageWithCustomData = (
  pageTitle: string,
  pageParameters?: Map<string, string> | string | null
): Promise<number> => {
  console.log('trackPageWithCustomData');
  if (pageParameters!==null && pageParameters instanceof Map){
      const params = pageParameters?.entries();
      const data = params != null ? Object.fromEntries(params) : {};
      return MappIntelligencePlugin.trackPageWithCustomData(data, pageTitle);
  } else {
    return MappIntelligencePlugin.trackPageWithCustomData(null, pageTitle);
  }
};

/**
 * Track user action
 * @param name - action name
 * @param eventParameters - predefined event parameters
 * @param sessionParamters - predefined session parameters
 * @param userCategories - predefined user categories
 * @param ecommerceParameters - predefined ecommerce parameters
 * @param campaignParameters - predefined campaign parameters
 * @returns result if method executed succesfully or not
 */
export const trackAction = (
  name: string,
  eventParameters?: EventParameters | null,
  sessionParamters?: SessionParameters | null,
  userCategories?: UserCategories | null,
  ecommerceParameters?: EcommerceParameters | null,
  campaignParameters?: CampaignParameters | null
): Promise<number> => {
  console.log('trackAction');
  return MappIntelligencePlugin.trackAction(
    name,
    convertEventParameters(eventParameters),
    convertSessionParamters(sessionParamters),
    convertUserCategories(userCategories),
    convertEcommerceParameters(ecommerceParameters),
    convertCampaignParameters(campaignParameters)
  );
};

/**
 * Track URL's with included deeplinks, media parameters
 * @param url single url that can contain some query parameters for tracking
 * @param mediaCode media code to track
 * @returns result if method executed succesfully or not
 */
export const trackUrl = (
  url: string,
  mediaCode?: string | null
): Promise<number> => {
  return MappIntelligencePlugin.trackUrl(url, mediaCode);
};

/**
 * Track video or audio events - starting, playing, pausing/stoping, ending of playing
 * @param mediaEvent predefined events to track
 * @returns result if method executed succesfully or not
 */
export const trackMedia = (mediaEvent: MediaEvent): Promise<number> => {
  console.log('Execute MediaEvent');
  return MappIntelligencePlugin.trackMedia(
    convertMediaEvent(mediaEvent as MediaEvent)
  );
};

/**
 * Record data about handled exceptions
 * @param e caught exception
 * @param stackTrace stack trace of the caught exception
 * @returns result if method executed succesfully or not
 */
export const trackException = (
  e: Error,
  stackTrace?: string | null
): Promise<number> => {
  return MappIntelligencePlugin.trackException(
    e.name,
    e.message?.slice(0, 1000),
    stackTrace?.slice(0, 1000)
  );
};

/**
 * Record data about handled exception
 * @param name name or type of the exception if can be obtained
 * @param message message of the current caught exception
 * @param stackTrace stack trace of the caught exception
 * @returns result if method executed succesfully or not
 */
export const trackExceptionWithName = (
  name: string,
  message: string,
  stackTrace?: string | null
): Promise<number> => {
  return MappIntelligencePlugin.trackException(
    name,
    message.slice(0, 1000),
    stackTrace?.slice(0, 1000)
  );
};

/**
 * Set unique everId as identifier for a single device/user
 * @param everId unique identifier in the tracking system
 * @returns result if method executed succesfully or not
 */
export const setEverId = (everId?: String | null): Promise<number> => {
  console.log('setEverId');
  return MappIntelligencePlugin.setEverId(everId);
};

/**
 * Returns current everId of a device
 * @returns everId
 */
export const getEverId = (): Promise<string> => {
  return MappIntelligencePlugin.getEverId();
};

/**
 * Check if plugin is initialized and ready to use
 * @returns true if plugin is ready to use; false otherwise.
 */
export const isInitialized = (): Promise<boolean> => {
  return MappIntelligencePlugin.isInitialized();
};

/**
 * Temporary sessionId is used when anonymous tracking is enabled to provide
 * anonymous tracking of a single session
 * @param sessionId unique session identifier
 * @returns result if method executed succesfully or not
 */
export const setTemporarySessionId = (
  sessionId?: String | null
): Promise<number> => {
  console.log('setTemporarySessionId');
  return MappIntelligencePlugin.setTemporarySessionId(sessionId);
};

/**
 * In some cases, it is necessary to exclude users completely from tracking.
 * For this purpose, the SDK provides an opt-out option.
 * Internally, calling this method will delete all current tracking data cached in the database (if sendCurrentData is set to false), cancel the sending of requests, terminate the WorkManager, and disable all incoming tracking requests.
 * @param sendData true to send recorded data before opt-out
 * @returns result if method executed succesfully or not
 */
export const optOut = (sendData: boolean): Promise<number> => {
  return MappIntelligencePlugin.optOut(sendData);
};

/**
 * Disables opt-out, and resets tracking to enabled.
 * @param sendData true to send recorded data before opt-in
 * @returns result if method executed succesfully or not
 */
export const optIn = (sendData: boolean): Promise<number> => {
  return MappIntelligencePlugin.optIn(sendData);
};

/**
 * Reset all webtrekk configuration. After this, new init with settings must be called before using plugin.
 * @returns result if method executed succesfully or not
 */
export const reset = (): Promise<number> => {
  return MappIntelligencePlugin.reset();
};

/**
 * When called, data will be immediately sent.
 * The request will then be deleted from the database, cleaning it.
 * Please note that the application must be started and visible to use this method.
 * @returns result if method executed succesfully or not
 */
export const sendRequestsAndClean = (): Promise<number> => {
  return MappIntelligencePlugin.sendRequestsAndClean();
};

/**
 * Get active configuration of the native SDK and returns it as a string
 * @returns string representation of the active configuration
 */
export const printCurrentConfig = (): Promise<string> => {
  return MappIntelligencePlugin.getCurrentConfig();
};

export * from './GlobalErrorHandler';
