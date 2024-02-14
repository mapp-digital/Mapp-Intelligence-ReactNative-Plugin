#import "MappinteligencePlugin.h"
#import "MappIntelligence.h"
#import "MappIntelligenceLogger.h"
#import <Foundation/Foundation.h>

@implementation MappinteligencePlugin
RCT_EXPORT_MODULE()

// Example method
// See // https://reactnative.dev/docs/native-modules-ios
RCT_EXPORT_METHOD(multiply:(double)a
                  b:(double)b
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    NSNumber *result = @(a * b);

    resolve(result);
}

RCT_EXPORT_METHOD(initWithConfiguration:(NSArray*)trackIDs
                                        domain:(NSString*)domain
                                        resolve:(RCTPromiseResolveBlock)resolve
                                        reject:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[MappIntelligence shared] initWithConfiguration:trackIDs onTrackdomain:domain];
    });
    resolve(@1);
}

RCT_EXPORT_METHOD(setLogLevel:(NSInteger)level
                                        resolve:(RCTPromiseResolveBlock)resolve
                                        reject:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[MappIntelligence shared] setLogLevel:(logLevel)level];
    });
    resolve(@1);
}

RCT_EXPORT_METHOD(setRequestInterval:(NSInteger)interval
                                        resolve:(RCTPromiseResolveBlock)resolve
                                        reject:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[MappIntelligence shared] setRequestInterval:60];
    });
    resolve(@1);
}

RCT_EXPORT_METHOD(setBatchSupportEnabled:(BOOL)enabled
                                        resolve:(RCTPromiseResolveBlock)resolve
                                        reject:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[MappIntelligence shared] setBatchSupportEnabled:enabled];
    });
    resolve(@1);
}

RCT_EXPORT_METHOD(setEnableBackgroundSendout:(BOOL)enabled
                                        resolve:(RCTPromiseResolveBlock)resolve
                                        reject:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[MappIntelligence shared] setEnableBackgroundSendout:true];
    });
    resolve(@1);
}

RCT_EXPORT_METHOD(setBatchSupportSize:(NSInteger)size
                                        resolve:(RCTPromiseResolveBlock)resolve
                                        reject:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[MappIntelligence shared] setBatchSupportSize:size];
    });
    resolve(@1);
}

RCT_EXPORT_METHOD(setRequestPerQueue:(NSInteger)numberOfRequsts
                                        resolve:(RCTPromiseResolveBlock)resolve
                                        reject:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[MappIntelligence shared] setRequestPerQueue:numberOfRequsts];
    });
    resolve(@1);
}


RCT_EXPORT_METHOD(setShouldMigrate:(BOOL)migrate
                                        resolve:(RCTPromiseResolveBlock)resolve
                                        reject:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[MappIntelligence shared] setShouldMigrate:migrate];
    });
    resolve(@1);
}

RCT_EXPORT_METHOD(setAnonymousTracking:(BOOL)anonymous
                                        resolve:(RCTPromiseResolveBlock)resolve
                                        reject:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[MappIntelligence shared] setAnonymousTracking:anonymous];
    });
    resolve(@1);
}

RCT_EXPORT_METHOD(setSendAppVersionInEveryRequest:(BOOL)flag
                                        resolve:(RCTPromiseResolveBlock)resolve
                                        reject:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[MappIntelligence shared] setSendAppVersionInEveryRequest:flag];
    });
    resolve(@1);
}

RCT_EXPORT_METHOD(setEnableUserMatching:(BOOL)enabled
                                        resolve:(RCTPromiseResolveBlock)resolve
                                        reject:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[MappIntelligence shared] setEnableUserMatching:enabled];
    });
    resolve(@1);
}

RCT_EXPORT_METHOD(trackPage:
                                        (RCTPromiseResolveBlock)resolve
                                        reject:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *topController = [UIApplication sharedApplication].keyWindow.rootViewController;

        while (topController.presentedViewController) {
            topController = topController.presentedViewController;
        }
        [[MappIntelligence shared] trackPageWithViewController:topController pageViewEvent:NULL];
    });
    resolve(@1);
}

//[[MappIntelligence shared] setEnableUserMatching:true];


@end
