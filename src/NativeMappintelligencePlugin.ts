import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  build(): Promise<number>;
  initWithConfiguration(trackIDs: number[], domain: string): Promise<number>;
  setLogLevel(level: number): Promise<number>;
  setExceptionLogLevel(level: number): Promise<number>;
  setRequestInterval(interval: number): Promise<number>;
  setBatchSupportEnabled(enabled: boolean): Promise<number>;
  setEnableBackgroundSendout(enabled: boolean): Promise<number>;
  setBatchSupportSize(size: number): Promise<number>;
  setRequestPerQueue(numberOfRequests: number): Promise<number>;
  setShouldMigrate(migrate: boolean): Promise<number>;
  setAnonymousTracking(anonymous: boolean): Promise<number>;
  setSendAppVersionInEveryRequest(flag: boolean): Promise<number>;
  setEnableUserMatching(enabled: boolean): Promise<number>;
  trackPage(pageTitle: string): Promise<number>;
  trackCustomPage(
    pageTitle: string,
    pageParameters: Object,
    sessionParameters: Object,
    userCategories: Object,
    ecommerceParameters: Object,
    campaignParameters: Object
  ): Promise<number>;
  trackPageWithCustomData(
    pageParameters: { [key: string]: string },
    pageTitle: string
  ): Promise<number>;
  trackAction(
    name: string,
    eventParameters: Object,
    sessionParameters: Object,
    userCategories: Object,
    ecommerceParameters: Object,
    campaignParameters: Object
  ): Promise<number>;
  trackUrl(url: string, mediaCode?: string): Promise<number>;
  trackMedia(mediaEvent: Object): Promise<number>;
  trackException(name: string, message: string, stackTrace?: string): Promise<number>;
  trackExceptionWithName(name: string, message: string, stackTrace?: string): Promise<number>;
  setEverId(everId?: string): Promise<number>;
  getEverId(): Promise<string>;
  isInitialized(): Promise<boolean>;
  setTemporarySessionId(sessionId?: string): Promise<number>;
  optOut(sendData: boolean): Promise<number>;
  optIn(sendData: boolean): Promise<number>;
  reset(): Promise<number>;
  sendRequestsAndClean(): Promise<number>;
  getCurrentConfig(): Promise<string>;
  nativeCrash(): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('MappinteligencePlugin');
