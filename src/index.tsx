import { NativeModules, Platform } from 'react-native';

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

export function multiply(a: number, b: number): Promise<number> {
  return MappinteligencePlugin.multiply(a, b);
}

export function initWithConfiguration(trackIDs: any, domain:string): Promise<number> {
  return MappinteligencePlugin.initWithConfiguration(trackIDs, domain)
}

export function setLogLevel(level:number): Promise<number> {
  return MappinteligencePlugin.setLogLevel(level)
}

export function setRequestInterval(interval:number): Promise<number> {
  return MappinteligencePlugin.setRequestInterval(interval)
}

export function setBatchSupportEnabled(enabled:boolean): Promise<number> {
  return MappinteligencePlugin.setBatchSupportEnabled(enabled)
}

export function setEnableBackgroundSendout(enabled:boolean): Promise<number> {
  return MappinteligencePlugin.setEnableBackgroundSendout(enabled)
}

export function setBatchSupportSize(size:number): Promise<number> {
  return MappinteligencePlugin.setBatchSupportSize(size)
}

export function setRequestPerQueue(numberOfRequsts:number): Promise<number> {
  return MappinteligencePlugin.setRequestPerQueue(numberOfRequsts)
}

export function setShouldMigrate(migrate:boolean): Promise<number> {
  return MappinteligencePlugin.setShouldMigrate(migrate)
}

export function setAnonymousTracking(anonymous:boolean): Promise<number> {
  return MappinteligencePlugin.setAnonymousTracking(anonymous)
}

export function setSendAppVersionInEveryRequest(flag:boolean): Promise<number> {
  return MappinteligencePlugin.setSendAppVersionInEveryRequest(flag)
}

export function setEnableUserMatching(enabled:boolean): Promise<number> {
  return MappinteligencePlugin.setEnableUserMatching(enabled)
}
//setEnableUserMatching