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
    converPageParameters(pageParameters),
    convertSessionParamters(sessionParamters),
    convertUserCategories(userCategories),
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
//MARK: methods for converting objects
function convertUserCategories(userCategories?: UserCategories | null) {
  if (userCategories == null) {
    return null;
  }
  const userCategorisesDict: Object = {
    birthday: JSON.stringify(userCategories?.birthday),
    city: userCategories?.city,
    country: userCategories?.country,
    emailAddress: userCategories?.emailAddress,
    emailReceiverId: userCategories?.emailReceiverId,
    firstName: userCategories?.firstName,
    gender: String(Number(userCategories?.gender)),
    customerId: userCategories?.customerId,
    lastName: userCategories?.lastName,
    newsletterSubscribed: userCategories?.newsletterSubscribed,
    phoneNumber: userCategories?.phoneNumber,
    street: userCategories?.street,
    streetNumber: userCategories?.streetNumber,
    zipCode: userCategories?.zipCode,
    customCategories: JSON.stringify(
      Object.fromEntries(userCategories?.customCategories)
    ),
  };
  return userCategorisesDict;
}

function converPageParameters(pageParameters?: PageParameters | null) {
  if (pageParameters == null) {
    return null;
  }
  const pagaParametersDict: Object = {
    params: JSON.stringify(Object.fromEntries(pageParameters?.params)),
    categories: JSON.stringify(Object.fromEntries(pageParameters?.categories)),
    searchTerm: pageParameters?.searchTerm,
  };
  return pagaParametersDict;
}

function convertSessionParamters(sessionParamaters?: SessionParameters | null) {
  if (sessionParamaters == null) {
    return null;
  }
  const seesionParamtersDict: string = {
    parameters: JSON.stringify(
      Object.fromEntries(sessionParamaters?.parameters)
    ),
  };
  return seesionParamtersDict;
}
