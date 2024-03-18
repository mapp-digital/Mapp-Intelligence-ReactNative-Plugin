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
RCT_EXPORT_METHOD(build:
                  (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{

    resolve(@1);
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

RCT_EXPORT_METHOD(trackPage:(NSString*)pageTitle
                                        reslove:(RCTPromiseResolveBlock)resolve
                                        reject:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        UIViewController *topController = [UIApplication sharedApplication].keyWindow.rootViewController;

        while (topController.presentedViewController) {
            topController = topController.presentedViewController;
        }
        if(pageTitle) {
          MIPageViewEvent* event = [[MIPageViewEvent alloc] initWithName:pageTitle];
          [[MappIntelligence shared] trackPage:event];
        } else {
          [[MappIntelligence shared] trackPageWithViewController:topController pageViewEvent:NULL];
        }
    });
    resolve(@1);
}

RCT_EXPORT_METHOD(trackCustomPage:(NSString*)pageTitle
                                        pageParameters:(NSDictionary*)pageParameters
                                        sessionParamters:(NSDictionary*)sessionParamters
                                        userCategories:(NSDictionary*)userCategories
                                        ecommerceParameters:(NSDictionary*)ecommerceParameters
                                        campaignParameters:(NSDictionary*)campaignParameters
                                        resolve:(RCTPromiseResolveBlock)resolve
                                        reject:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        MIPageViewEvent* event = [[MIPageViewEvent alloc] initWithName:pageTitle];

        [event setPageParameters:[self preparePageParameters:pageParameters]];
        [event setUserCategories:[self prepareUserCategories:userCategories]];
        [event setSessionParameters:[self prepareSessionParameters:sessionParamters]];

        [[MappIntelligence shared] trackPage:event];
    });
    resolve(@1);
}

RCT_EXPORT_METHOD(trackPageWithCustomData:(NSDictionary*)pageParameters
                                            pageTitle:(NSString*)pageTitle
                                            resolve:(RCTPromiseResolveBlock)resolve
                                            reject:(RCTPromiseRejectBlock)reject)
    {
        dispatch_async(dispatch_get_main_queue(), ^{
            [[MappIntelligence shared] trackCustomPage:pageTitle trackingParams:pageParameters];
        });
        resolve(@1);
    }

RCT_EXPORT_METHOD(trackAction:(NSString*)name
                                        eventParameters:(NSDictionary*)eventParameters
                                        sessionParamters:(NSDictionary*)sessionParamters
                                        userCategories:(NSDictionary*)userCategories
                                        ecommerceParameters:(NSDictionary*)ecommerceParameters
                                        campaignParameters:(NSDictionary*)campaignParameters
                                        resolve:(RCTPromiseResolveBlock)resolve
                                        reject:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
         MIActionEvent* actionEvent = [[MIActionEvent alloc] initWithName:name];

        if (eventParameters) {
            NSMutableDictionary* eDict = [eventParameters mutableCopy];
             MIEventParameters* eParameters = [[MIEventParameters alloc] initWithDictionary:[self getFromString:eDict[@"parameters"]]];
            [actionEvent setEventParameters:eParameters];
        }
        if (userCategories) {
            NSMutableDictionary* userCatDict = [userCategories mutableCopy];
            if (userCatDict[@"birthday"]) {
                userCatDict[@"birthday"] = [self getFromString:userCategories[@"birthday"]];
            }
            if (userCatDict[@"birthday"]) {
                userCatDict[@"customCategories"] = [self getFromString:userCategories[@"customCategories"]];
            }
            MIUserCategories* userCategoriesNew = [[MIUserCategories alloc] initWithDictionary:userCatDict];
            [actionEvent setUserCategories:userCategoriesNew];
        }
        if (sessionParamters) {
            NSMutableDictionary* sDict = [sessionParamters mutableCopy];
            MISessionParameters* sessionParamtersObject = [[MISessionParameters alloc] initWithParameters:[self getFromString:sDict[@"parameters"]]];
            [actionEvent setSessionParameters:sessionParamtersObject];
        }

        if (ecommerceParameters) {
            MIEcommerceParameters* ecoParameters = [[MIEcommerceParameters alloc] initWithDictionary:ecommerceParameters];
            [actionEvent setEcommerceParameters:ecoParameters];
        }

        if(campaignParameters) {
            MICampaignParameters* cParamaters = [[MICampaignParameters alloc] initWithDictionary:campaignParameters];
            [actionEvent setCampaignParameters:cParamaters];
        }

        [[MappIntelligence shared] trackAction:actionEvent];
    });
    resolve(@1);
}

//MARK: helper methods
-(NSMutableDictionary*)getFromString:(NSString*)item {
    NSString *jsonString = item;
    NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
    NSError *error;
    NSMutableDictionary *dataParam = [NSJSONSerialization JSONObjectWithData:jsonData
                                                       options:NSJSONReadingAllowFragments
                                                         error:&error];
    return dataParam;
}

-(MIPageParameters*)preparePageParameters:(NSDictionary*) pageParameters {
    if (pageParameters == NULL) {
        return NULL;
    }
    MIPageParameters* parameter = [[MIPageParameters alloc] initWithPageParams:pageParameters[@"params"] pageCategory:pageParameters[@"categories"] search:pageParameters[@"searchTerm"]];
    return parameter;
}

-(MIUserCategories*)prepareUserCategories:(NSDictionary*) userCategories {
    if (userCategories == NULL) {
        return NULL;
    }
    MIUserCategories* userCategoriesNew = [[MIUserCategories alloc] initWithDictionary:userCategories];
    return userCategoriesNew;
}

-(MISessionParameters*)prepareSessionParameters:(NSDictionary*) sessionParamters {
    if (sessionParamters == NULL) {
        return NULL;
    }
    MISessionParameters* sessionParamtersObject = [[MISessionParameters alloc] initWithParameters:sessionParamters];
    return sessionParamtersObject;
}

//[[MappIntelligence shared] setEnableUserMatching:true];


@end
