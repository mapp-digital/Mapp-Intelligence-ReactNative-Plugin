import { NativeModules, Platform } from 'react-native';
import type {
  CampaignParameters,
  EcommerceParameters,
  EventParameters,
  MIProduct,
  PageParameters,
  SessionParameters,
  UserCategories,
} from './helperMethods';

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

export function build(): Promise<number> {
  console.log('build');
  return MappIntelligencePlugin.build();
}

export function initWithConfiguration(
  trackIDs: any,
  domain: string
): Promise<number> {
  console.log('initWithConfiguration');
  return MappIntelligencePlugin.initWithConfiguration(trackIDs, domain);
}

export function setLogLevel(level: number): Promise<number> {
  console.log('setLogLevel');
  return MappIntelligencePlugin.setLogLevel(level);
}

export function setRequestInterval(interval: number): Promise<number> {
  console.log('setRequestInterval');
  return MappIntelligencePlugin.setRequestInterval(interval);
}

export function setBatchSupportEnabled(enabled: boolean): Promise<number> {
  console.log('setBatchSupportEnabled');
  return MappIntelligencePlugin.setBatchSupportEnabled(enabled);
}

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
export function trackPage(): Promise<number> {
  console.log('trackPage');
  return MappIntelligencePlugin.trackPage();
}

export function trackCustomPage(
  pageParameters?: PageParameters | null,
  sessionParamters?: SessionParameters | null,
  userCategories?: UserCategories | null,
  ecommerceParameters?: EcommerceParameters | null,
  campaignParameters?: CampaignParameters | null
): Promise<number> {
  console.log('trackCustomPage');
  return MappIntelligencePlugin.trackCustomPage(
    convertPageParameters(pageParameters),
    convertSessionParamters(sessionParamters),
    convertUserCategories(userCategories),
    convertEcommerceParameters(ecommerceParameters),
    convertCapaignParameters(campaignParameters)
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
  return MappIntelligencePlugin.trackAction(
    name,
    eventParameters,
    sessionParamters,
    userCategories,
    ecommerceParameters,
    campaignParameters
  );
}

export function setEverId(everId?: String | null): Promise<number> {
  console.log('setEverId');
  return MappIntelligencePlugin.setEverId(everId);
}

export function setTemporarySessionId(
  sessionId?: String | null
): Promise<number> {
  console.log('setTemporarySessionId');
  return MappIntelligencePlugin.setTemporarySessionId(sessionId);
}
//MARK: methods for converting objects
function convertUserCategories(userCategories?: UserCategories | null) {
  if (userCategories == null) {
    return null;
  }
  console.log('convertUserCategories');
  const birthday = userCategories?.birthday;
  const categories = userCategories?.customCategories;

  const userCategorisesDict: Object = {
    birthday:
      birthday != null
        ? { day: birthday.day, month: birthday.month, year: birthday.year }
        : null,
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
    customCategories:
      categories != null ? Object.fromEntries(categories.entries()) : null,
  };
  return userCategorisesDict;
}

function convertPageParameters(
  pageParameters?: PageParameters | null
): Object | null {
  console.log('convertPageParameters');
  if (pageParameters == null) {
    return null;
  }

  const params = pageParameters?.params;
  const cat = pageParameters?.categories;

  const page: Object = {
    params: params != null ? Object.fromEntries(params.entries()) : {},
    categories: cat != null ? Object.fromEntries(cat) : {},
    searchTerm: pageParameters?.searchTerm,
  };

  return page;
}

function convertSessionParamters(
  sessionParamaters?: SessionParameters | null
): Object | null {
  console.log('convertSessionParamters');
  if (sessionParamaters == null) {
    return null;
  }
  const data = sessionParamaters?.parameters;
  return data != null ? Object.fromEntries(data.entries()) : {};
}

function convertEcommerceParameters(
  ecommerceParameters?: EcommerceParameters | null
): Object | null {
  if (ecommerceParameters == null) {
    return null;
  }

  let products: Object[] = [];
  ecommerceParameters.products?.map((item) => {
    let categories = item.categories;
    let ecommercParams = item.ecommerceParameters;

    products.push({
      name: item?.name,
      cost: item.cost,
      quantity: item.quantity,
      productAdvertiseID: item.productAdvertiseID,
      productSoldOut: item.productSoldOut,
      productVariant: item.productVariant,
      categories:
        categories != null ? Object.fromEntries(categories.entries()) : {},
      ecommerceParameters:
        ecommercParams != null
          ? Object.fromEntries(ecommercParams.entries())
          : {},
    });
  });

  const customParams = ecommerceParameters.customParameters;

  const ecommerce: Object = {
    products: products,
    status: ecommerceParameters.status?.valueOf,
    currency: ecommerceParameters.currency,
    orderID: ecommerceParameters.orderID,
    orderValue: ecommerceParameters.orderValue,
    returningOrNewCustomer: ecommerceParameters.returningOrNewCustomer,
    returnValue: ecommerceParameters.returnValue,
    cancellationValue: ecommerceParameters.cancellationValue,
    couponValue: ecommerceParameters.couponValue,
    paymentMethod: ecommerceParameters.paymentMethod,
    shippingServiceProvider: ecommerceParameters.shippingServiceProvider,
    shippingSpeed: ecommerceParameters.shippingSpeed,
    shippingCost: ecommerceParameters.shippingCost,
    markUp: ecommerceParameters.markUp,
    orderStatus: ecommerceParameters.orderStatus,
    customParameters:
      customParams != null ? Object.fromEntries(customParams.entries()) : {},
  };

  return ecommerce;
}

function convertCapaignParameters(
  campaignParameters?: CampaignParameters | null
): Object | null {
  if (campaignParameters == null) {
    return null;
  }

  const params = campaignParameters?.customParameters;

  const campaign: Object = {
    campaignId: campaignParameters?.campaignId,
    action: campaignParameters?.action,
    mediaCode: campaignParameters?.mediaCode,
    oncePerSession: campaignParameters?.oncePerSession,
    customParameters:
      params != null ? Object.fromEntries(params.entries()) : {},
  };
  return campaign;
}
