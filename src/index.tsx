import { NativeModules, Platform } from 'react-native';
import type {
  CampaignParameters,
  EcommerceParameters,
  EventParameters,
  PageParameters,
  SessionParameters,
  UserCategories,
} from './helperMethods';

const LINKING_ERROR =
  `The package 'react-native-mappinteligence-plugin' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const MappinteligencePlugin = NativeModules.MappinteligencePlugin
  ? NativeModules.MappinteligencePlugin
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function build(): Promise<number> {
  return MappinteligencePlugin.build();
}

export function initWithConfiguration(
  trackIDs: any,
  domain: string
): Promise<number> {
  return MappinteligencePlugin.initWithConfiguration(trackIDs, domain);
}

export function setLogLevel(level: number): Promise<number> {
  return MappinteligencePlugin.setLogLevel(level);
}

export function setRequestInterval(interval: number): Promise<number> {
  return MappinteligencePlugin.setRequestInterval(interval);
}

export function setBatchSupportEnabled(enabled: boolean): Promise<number> {
  return MappinteligencePlugin.setBatchSupportEnabled(enabled);
}

export function setEnableBackgroundSendout(enabled: boolean): Promise<number> {
  return MappinteligencePlugin.setEnableBackgroundSendout(enabled);
}

export function setBatchSupportSize(size: number): Promise<number> {
  return MappinteligencePlugin.setBatchSupportSize(size);
}

export function setRequestPerQueue(numberOfRequsts: number): Promise<number> {
  return MappinteligencePlugin.setRequestPerQueue(numberOfRequsts);
}

export function setShouldMigrate(migrate: boolean): Promise<number> {
  return MappinteligencePlugin.setShouldMigrate(migrate);
}

export function setAnonymousTracking(anonymous: boolean): Promise<number> {
  return MappinteligencePlugin.setAnonymousTracking(anonymous);
}

export function setSendAppVersionInEveryRequest(
  flag: boolean
): Promise<number> {
  return MappinteligencePlugin.setSendAppVersionInEveryRequest(flag);
}

export function setEnableUserMatching(enabled: boolean): Promise<number> {
  return MappinteligencePlugin.setEnableUserMatching(enabled);
}

//TODO: parameterless function??
export function trackPage(): Promise<number> {
  return MappinteligencePlugin.trackPage();
}

export function trackCustomPage(
  pageParameters?: PageParameters | null,
  sessionParamters?: SessionParameters | null,
  userCategories?: UserCategories | null,
  ecommerceParameters?: EcommerceParameters | null,
  campaignParameters?: CampaignParameters | null
): Promise<number> {
  return MappinteligencePlugin.trackCustomPage(
    pageParameters,
    sessionParamters,
    userCategories,
    ecommerceParameters,
    campaignParameters
  );
}
export function trackPageWithCustomData(
  pageParameters: Map<string, string>,
  pageTitle: string
): Promise<number> {
  return MappinteligencePlugin.trackPageWithCustomData(
    /* can this be just Map<string, string> 
    it should be Dictionary/ReadableMap on native sides iOS/Android ??? */
    JSON.stringify(Object.fromEntries(pageParameters)),
    pageTitle
  );
}

export function trackAction(
  name: string,
  eventParameters?: EventParameters | null,
  sessionParamters?: SessionParameters | null,
  userCategories?: UserCategories | null,
  ecommerceParameters?: EcommerceParameters | null,
  campaignParameters?: CampaignParameters | null
): Promise<number> {
  return MappinteligencePlugin.trackAction(
    name,
    eventParameters,
    sessionParamters,
    userCategories,
    ecommerceParameters,
    campaignParameters
  );
}

export function setEverId(everId?: String | null): Promise<number> {
  return MappinteligencePlugin.setEverId(everId);
}

export function setTemporarySessionId(
  sessionId?: String | null
): Promise<number> {
  return MappinteligencePlugin.setTemporarySessionId(sessionId);
}
//setEnableUserMatching
