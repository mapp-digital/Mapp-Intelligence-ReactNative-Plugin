import type {
  UserCategories,
  PageParameters,
  SessionParameters,
  EcommerceParameters,
  CampaignParameters,
  EventParameters,
  MediaParameteres,
  MediaEvent,
} from './DataTypes';

//MARK: methods for converting objects
export function convertUserCategories(userCategories?: UserCategories | null) {
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
    gender: userCategories?.gender,
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

export function convertPageParameters(
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

export function convertSessionParamters(
  sessionParamaters?: SessionParameters | null
): Object | null {
  console.log('convertSessionParamters');
  if (sessionParamaters == null) {
    return null;
  }
  const data = sessionParamaters?.parameters;
  return data != null ? Object.fromEntries(data.entries()) : {};
}

export function convertEcommerceParameters(
  ecommerceParameters?: EcommerceParameters | null
): Object | null {
  console.log('convertEcommerceParameters');
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
    status: ecommerceParameters.status,
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

export function convertCampaignParameters(
  campaignParameters?: CampaignParameters | null
): Object | null {
  console.log('convertCapaignParameters');
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

export function convertEventParameters(
  event?: EventParameters | null
): Object | null {
  if (event == null) {
    return null;
  }

  const customParams =
    event.customParameters != null
      ? Object.fromEntries(event.customParameters?.entries())
      : null;

  const eventParams: Object = {
    customParameters: customParams,
  };

  return eventParams;
}

export function convertMediaParameters(
  mediaParam?: MediaParameteres | null
): Object | null {
  if (mediaParam == null) {
    return null;
  }

  const params: Object = {
    name: mediaParam?.name,
    action: mediaParam?.action,
    position: mediaParam?.position,
    duration: mediaParam?.duration,
    bandwith: mediaParam?.bandwith,
    soundIsMuted: mediaParam?.soundIsMuted,
    soundVolume: mediaParam?.soundVolume,
    customCategories:
      mediaParam?.customCategories != null
        ? Object.fromEntries(mediaParam.customCategories?.entries())
        : null,
  };

  return params;
}

export function convertMediaEvent(
  mediaEvent?: MediaEvent | null
): Object | null {
  if (mediaEvent == null) {
    return null;
  }

  const custom =
    mediaEvent.customParameters != null
      ? Object.fromEntries(mediaEvent?.customParameters?.entries())
      : null;
  const eCommerce = convertEcommerceParameters(mediaEvent.eCommerceParameters);
  const session = convertSessionParamters(mediaEvent.sessionParameters);
  const event = convertEventParameters(mediaEvent.eventParameters);
  const mediaParams = convertMediaParameters(mediaEvent.parameters);

  const data: Object = {
    pageName: mediaEvent.pageName,
    parameters: mediaParams,
    eventParameters: event,
    sessionParameters: session,
    eCommerceParameters: eCommerce,
    customParameters: custom,
  };

  return data;
}
