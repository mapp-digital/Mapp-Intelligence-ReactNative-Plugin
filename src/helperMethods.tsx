interface PartialPageParameters {
  searchTerm?: string | null;
  params?: string | null;
  categories?: string | null;
}
export type PageParameters = Required<PartialPageParameters>;

interface PartialBirthday {
  day: number;
  month: number;
  year: number;
}
export type MIBirthday = Required<PartialBirthday>;

export enum MIGender {
  unknown = 1,
  male = 2,
  female = 3,
}

interface PartialUserCategoris {
  birthday?: String;
  city?: string;
  country?: string;
  emailAddress?: string;
  emailReceiverId?: string;
  firstName?: string;
  gender?: string;
  customerId?: string;
  lastName?: string;
  newsletterSubscribed?: boolean;
  phoneNumber?: string;
  street?: string;
  streetNumber?: string;
  zipCode?: string;
  customCategories?: string;
}
export type UserCategories = Required<PartialUserCategoris>;

interface ParticularEcommerceParameters {
  products?: [MIProduct] | null;
  status?: MIStatus | null;
  currency?: string | null;
  orderID?: string | null;
  orderValue?: number | null;
  returningOrNewCustomer?: string | null;
  returnValue?: number | null;
  cancellationValue?: number | null;
  couponValue?: number | null;
  paymentMethod?: string | null;
  shippingServiceProvider?: string | null;
  shippingSpeed?: string | null;
  shippingCost?: number | null;
  markUp?: number | null;
  orderStatus?: string | null;
  customParameters?: [number, string] | null;
}
export type EcommerceParameters = Required<ParticularEcommerceParameters>;

interface ParticularMIProduct {
  name?: string | null;
  cost?: number | null;
  quantity?: number | null;
  productAdvertiseID?: number | null;
  productSoldOut?: number | null;
  productVariant?: string | null;
  categories?: [number, string] | null;
  ecommerceParameters?: EcommerceParameters | null;
}
export type MIProduct = Required<ParticularMIProduct>;

enum MIStatus {
  noneStatus = 0,
  addedToBasket = 1,
  purchased = 2,
  viewed = 3,
  deletedFromBasket = 4,
  addedToWishlist = 5,
  deletedFromWishlist = 6,
  checkout = 7,
}

enum MIAction {
  click = 1,
  view = 2,
}

interface ParticularCampaignParameters {
  campaignId?: string | null;
  action?: MIAction | null;
  mediaCode?: string | null;
  oncePerSession?: boolean | null;
  customParameters?: [number, string] | null;
}
export type CampaignParameters = Required<ParticularCampaignParameters>;

interface ParticularSessionParameters {
  parameters?: string | null;
}
export type SessionParameters = Required<ParticularSessionParameters>;

interface ParticularEventParameters {
    parameters?: string | null;
  }
  export type EventParameters = Required<ParticularEventParameters>;
