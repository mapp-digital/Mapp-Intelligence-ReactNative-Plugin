interface PartialPageParameters {
  searchTerm?: string | null;
  params?: Map<number, string> | null;
  categories?: Map<number, string> | null;
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
  birthday?: MIBirthday | null;
  city?: string | null;
  country?: string | null;
  emailAddress?: string | null;
  emailReceiverId?: string | null;
  firstName?: string | null;
  gender?: MIGender | MIGender.unknown;
  customerId?: string | null;
  lastName?: string | null;
  newsletterSubscribed?: boolean | null;
  phoneNumber?: string | null;
  street?: string | null;
  streetNumber?: string | null;
  zipCode?: string | null | undefined;
  customCategories?: Map<number, string> | null;
}

export type UserCategories = PartialUserCategoris;

interface ParticularEcommerceParameters {
  products?: MIProduct[] | null;
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
  customParameters?: Map<number, string> | null;
}
export type EcommerceParameters = Required<ParticularEcommerceParameters>;

export interface MIProduct {
  name?: string | null;
  cost?: number | null;
  quantity?: number | null;
  productAdvertiseID?: number | null;
  productSoldOut?: boolean | null;
  productVariant?: string | null;
  categories?: Map<number, string> | null;
  ecommerceParameters?: Map<string, string> | null;
}

export enum MIStatus {
  noneStatus = 0,
  addedToBasket = 1,
  purchased = 2,
  viewed = 3,
  deletedFromBasket = 4,
  addedToWishlist = 5,
  deletedFromWishlist = 6,
  checkout = 7,
}

export enum MIAction {
  click = 1,
  view = 2,
}

interface ParticularCampaignParameters {
  campaignId?: string | null;
  action?: MIAction | null;
  mediaCode?: string | null;
  oncePerSession?: boolean | null;
  customParameters?: Map<number, string> | null;
}
export type CampaignParameters = Required<ParticularCampaignParameters>;

interface ParticularSessionParameters {
  parameters?: Map<number, string> | string | null;
}
export type SessionParameters = Required<ParticularSessionParameters>;

export interface EventParameters {
  customParameters: Map<number, string>;
}

export enum MediaParam {
  media_category = 'mg',
  media_action = 'mk',
  media_position = 'mt1',
  media_duration = 'mt2',
  bandwidth = 'bw',
  volume = 'vol',
  mute = 'mut',
  name = 'mi',
}
export interface MediaParameteres {
  name: string;
  action: string;
  position: number;
  duration: number;
  bandwith?: number | null;
  soundIsMuted?: boolean | null;
  soundVolume?: number | null;
  customCategories: Map<number, string> | null;
}

export interface MediaEvent {
  pageName: string;
  parameters: MediaParameteres | null;
  eventParameters?: EventParameters | null;
  sessionParameters?: SessionParameters | null;
  eCommerceParameters?: EcommerceParameters | null;
  customParameters?: Map<string, string> | null;
}

export enum ExceptionType {
  none = 0,
  uncaught = 1,
  caught = 2,
  custom = 3,
  all = 4,
  uncaught_and_custom = 5,
  uncaught_and_caught = 6,
  custom_and_caught = 7,
}
