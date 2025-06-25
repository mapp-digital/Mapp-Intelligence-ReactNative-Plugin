#import "MappinteligencePlugin.h"
#import "MappIntelligence.h"
#import "MappIntelligenceLogger.h"
#import "MIDefaultTracker.h"
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

RCT_EXPORT_METHOD(isInitialized:
                  (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    BOOL status = [MappIntelligence getId] != NULL && [MappIntelligence getUrl] != NULL;
    resolve((status ? @1 : @0) );
}

RCT_EXPORT_METHOD(setTemporarySessionId:(NSString*)sessionId
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [[MappIntelligence shared] setTemporarySessionId:sessionId];
    resolve(@1);
}

RCT_EXPORT_METHOD(getEverId:
                  (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    resolve([[MappIntelligence shared] getEverId]);
}

RCT_EXPORT_METHOD(setEverId:(NSString*)everId
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [[MappIntelligence shared] initWithConfiguration:@[[MappIntelligence getId]] onTrackdomain:[MappIntelligence getUrl] andWithEverID:everId];
    [[MappIntelligence shared] setLogLevel:all];
    resolve(@1);
}

RCT_EXPORT_METHOD(optOut:(BOOL)sendData
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [[MappIntelligence shared] optOutAndSendCurrentData:sendData];
    resolve(@1);
}

RCT_EXPORT_METHOD(sendRequestsAndClean:
                  (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [[MIDefaultTracker sharedInstance] sendRequestFromDatabaseWithCompletionHandler:^(NSError * _Nullable error) {
        if (error) {
            NSLog(@"error: %@", error);
        }
    }];
    resolve(@1);
}

RCT_EXPORT_METHOD(optIn:(BOOL)sendData
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    [[MappIntelligence shared] optIn];
    resolve(@1);
}

RCT_EXPORT_METHOD(reset:
                  (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[MappIntelligence shared] reset];
    });
    resolve(@1);
}

RCT_EXPORT_METHOD(getCurrentConfig:
                  (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[MappIntelligence shared] setBatchSupportEnabled:[[MappIntelligence shared] batchSupportEnabled]];
    });
    resolve(@"print configuration:");
}

RCT_EXPORT_METHOD(nativeCrash:
                  (RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
    // Dereference a null pointer (EXC_BAD_ACCESS)
    int *ptr = NULL;
    *ptr = 42; // 💥 Crash happens here
    resolve(@"success");
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

RCT_EXPORT_METHOD(setExceptionLogLevel:(NSInteger)level
                                        resolve:(RCTPromiseResolveBlock)resolve
                                        reject:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        [[MappIntelligence shared] enableCrashTracking:(exceptionType)(level + 1)];
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
                                        pageParameters:(id)pageParameters
                                        sessionParamters:(id)sessionParamters
                                        userCategories:(id)userCategories
                                        ecommerceParameters:(id)ecommerceParameters
                                        campaignParameters:(id)campaignParameters
                                        resolve:(RCTPromiseResolveBlock)resolve
                                        reject:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        MIPageViewEvent* event = [[MIPageViewEvent alloc] initWithName:pageTitle];
      
      NSDictionary* pp = [pageParameters isKindOfClass:[NSNull class]] ? nil : (NSDictionary*)pageParameters;
      NSDictionary* sp = [sessionParamters isKindOfClass:[NSNull class]] ? nil : (NSDictionary*)sessionParamters;
      NSDictionary* uc = [userCategories isKindOfClass:[NSNull class]] ? nil : (NSDictionary*)userCategories;
      NSDictionary* ep = [ecommerceParameters isKindOfClass:[NSNull class]] ? nil : (NSDictionary*)ecommerceParameters;
      NSDictionary* cp = [campaignParameters isKindOfClass:[NSNull class]] ? nil : (NSDictionary*)campaignParameters;


        [event setPageParameters:[self preparePageParameters:pp]];
        [event setUserCategories:[self prepareUserCategories:uc]];
        [event setSessionParameters:[self prepareSessionParameters:sp]];
        [event setEcommerceParameters:[self prepareEcommerceParameters:ep]];
        [event setCampaignParameters:[self prepareCampaignParameters:cp]];
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
                                        eventParameters:(id)eventParameters
                                        sessionParamters:(id)sessionParamters
                                        userCategories:(id)userCategories
                                        ecommerceParameters:(id)ecommerceParameters
                                        campaignParameters:(id)campaignParameters
                                        resolve:(RCTPromiseResolveBlock)resolve
                                        reject:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
         MIActionEvent* actionEvent = [[MIActionEvent alloc] initWithName:name];

         NSDictionary* ep = [eventParameters isKindOfClass:[NSNull class]] ? nil : (NSDictionary*)eventParameters;
         NSDictionary* sp = [sessionParamters isKindOfClass:[NSNull class]] ? nil : (NSDictionary*)sessionParamters;
         NSDictionary* uc = [userCategories isKindOfClass:[NSNull class]] ? nil : (NSDictionary*)userCategories;
         NSDictionary* ecp = [ecommerceParameters isKindOfClass:[NSNull class]] ? nil : (NSDictionary*)ecommerceParameters;
         NSDictionary* cp = [campaignParameters isKindOfClass:[NSNull class]] ? nil : (NSDictionary*)campaignParameters;

        [actionEvent setEventParameters:[self prepareEventParamters:ep]];
        [actionEvent setUserCategories:[self prepareUserCategories:uc]];
        [actionEvent setSessionParameters:[self prepareSessionParameters:sp]];
        [actionEvent setEcommerceParameters:[self prepareEcommerceParameters:ecp]];
        [actionEvent setCampaignParameters:[self prepareCampaignParameters:cp]];

        [[MappIntelligence shared] trackAction:actionEvent];
    });
    resolve(@1);
}

RCT_EXPORT_METHOD(trackUrl:(NSString*)url
                                       mediaCode:(NSString*)mediaCode
                                       resolve:(RCTPromiseResolveBlock)resolve
                                       reject:(RCTPromiseRejectBlock)reject)
{
   dispatch_async(dispatch_get_main_queue(), ^{

       [[MappIntelligence shared] trackUrl:[[NSURL alloc] initWithString:url] withMediaCode:mediaCode];
   });
   resolve(@1);
}

#define key_name @"name"
#define key_action @"action"
#define key_bandwith @"bandwith"
#define key_duration @"duration"
#define key_position @"position"
#define key_sound_is_muted @"soundIsMuted"
#define key_sound_volume @"soundVolume"
#define key_custom_categories @"customCategories"

RCT_EXPORT_METHOD(trackCustomMedia:(NSString*)pageName
                                       name:(NSString*)name
                                       customParams:(id)customParams
                                       resolve:(RCTPromiseResolveBlock)resolve
                                       reject:(RCTPromiseRejectBlock)reject)
{
   dispatch_async(dispatch_get_main_queue(), ^{
     NSDictionary* cp = [customParams isKindOfClass:[NSNull class]] ? nil : (NSDictionary*)customParams;
       MIMediaParameters* mParameters = [self prepareMediaParameters:cp];
       mParameters.name = name;
       MIMediaEvent* mediaEvent = [[MIMediaEvent alloc] initWithPageName:pageName parameters:mParameters];
       [[MappIntelligence shared] trackMedia:mediaEvent];
   });
   resolve(@1);
}

RCT_EXPORT_METHOD(trackMedia:(NSDictionary*)mediaEventDictionary
                                       resolve:(RCTPromiseResolveBlock)resolve
                                       reject:(RCTPromiseRejectBlock)reject)
{
   dispatch_async(dispatch_get_main_queue(), ^{
       if(!mediaEventDictionary[@"parameters"]) {
           NSLog(@"Media event must have page name");
       }
       NSDictionary* mp = [mediaEventDictionary isKindOfClass:[NSNull class]] ? nil : (NSDictionary*)mediaEventDictionary;
       MIMediaParameters* mParameters = [self prepareMediaParameters:mp[@"parameters"]];
       MIMediaEvent* mediaEvent = [[MIMediaEvent alloc] initWithPageName:mediaEventDictionary[@"parameters"][@"name"] parameters:mParameters];
       [mediaEvent setEventParameters:[self prepareEventParamters:mediaEventDictionary[@"eventParameters"]]];
       [mediaEvent setPageName:mediaEventDictionary[@"pageName"]];
       [mediaEvent setSessionParameters:[self prepareSessionParameters:mediaEventDictionary[@"sessionParameters"]]];
       [mediaEvent setEcommerceParameters:[self prepareEcommerceParameters:mediaEventDictionary[@"eCommerceParameters"]]];

       [[MappIntelligence shared] trackMedia:mediaEvent];
   });
   resolve(@1);
}

RCT_EXPORT_METHOD(trackException:(NSString*)name
                                       message:(NSString*)message
                                       stackTrace:(NSString*)stackTrace
                                       resolve:(RCTPromiseResolveBlock)resolve
                                       reject:(RCTPromiseRejectBlock)reject)
{
   dispatch_async(dispatch_get_main_queue(), ^{

       if (stackTrace) {
           NSDictionary *userInfo = @{
             NSLocalizedDescriptionKey: NSLocalizedString(message, nil),
             NSLocalizedFailureReasonErrorKey: NSLocalizedString(stackTrace, nil),
             NSLocalizedRecoverySuggestionErrorKey: NSLocalizedString(@"", nil)
                                     };
           NSError *error = [NSError errorWithDomain:name
                                                code:-57
                                            userInfo:userInfo];
           [[MappIntelligence shared] trackExceptionWith:error];
       } else {
           [[MappIntelligence shared] trackExceptionWithName:name andWithMessage:message];
       }
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
    NSDictionary* pParameters = [self clearDictionaryFromNull:[pageParameters mutableCopy]];
    MIPageParameters* parameter = [[MIPageParameters alloc] initWithPageParams:pParameters[@"params"] pageCategory:pParameters[@"categories"] search:pParameters[@"searchTerm"]];
    return parameter;
}

-(MIMediaParameters*)prepareMediaParameters:(NSDictionary*) mediaParameters {
    if (mediaParameters == NULL) {
        return NULL;
    }
    MIMediaParameters* testparams = [[MIMediaParameters alloc] initWithDictionary:mediaParameters];
    if(testparams) {
        return testparams;
    }
    NSMutableDictionary* dict = [[NSMutableDictionary alloc] init];

    for (NSString *paramKey in mediaParameters.allKeys) {
         id paramValue = mediaParameters[paramKey];
         NSString *key = nil;

         if ([paramKey isEqualToString:@"mk"]) {
             key = key_action;
         } else if ([paramKey isEqualToString:@"mt1"]) {
             paramValue = [self extractFirstNumberFromString:mediaParameters[paramKey]];
             key = key_position;
         } else if ([paramKey isEqualToString:@"mt2"]) {
             paramValue = [self extractFirstNumberFromString:mediaParameters[paramKey]];
             key = key_duration;
         } else if ([paramKey isEqualToString:@"mut"]) {
             paramValue = [self extractFirstNumberFromString:mediaParameters[paramKey]];
             key = key_sound_is_muted;
         } else if ([paramKey isEqualToString:@"vol"]) {
             paramValue = [self extractFirstNumberFromString:mediaParameters[paramKey]];
             key = key_sound_volume;
         } else if ([paramKey isEqualToString:@"bw"]) {
             paramValue = [self extractFirstNumberFromString:mediaParameters[paramKey]];
             key = key_bandwith;
         }

         if (key) {
             [dict setObject:paramValue forKey:key];
         }
     }
    MIMediaParameters* mParameters = [[MIMediaParameters alloc] initWithDictionary:[self clearDictionaryFromNull:dict]];
    return mParameters;
}

- (NSNumber *)extractFirstNumberFromString:(NSString *)inputString {
    NSScanner *scanner = [NSScanner scannerWithString:inputString];
    NSCharacterSet *numbers = [NSCharacterSet decimalDigitCharacterSet];
    BOOL found = [scanner scanCharactersFromSet:numbers intoString:nil];

    if (found) {
        NSInteger extractedNumber;
        [scanner scanInteger:&extractedNumber];
        return @(extractedNumber);
    } else {
        return nil;
    }
}

-(MIEventParameters*)prepareEventParamters:(NSDictionary*) eventParameters {
    if (eventParameters == NULL || eventParameters == [NSNull null]) {
        return NULL;
    }
    NSDictionary* eParameters = [self clearDictionaryFromNull:[eventParameters mutableCopy]];
    //this is difference from Android
    id value = [eParameters objectForKey:@"customParameters"];
    [eParameters setValue:value forKey:@"parameters"];
    MIEventParameters* eventParamtersNew = [[MIEventParameters alloc] initWithDictionary:eParameters];
    return eventParamtersNew;
}

-(MIUserCategories*)prepareUserCategories:(NSDictionary*) userCategories {
    if (userCategories == NULL || userCategories == [NSNull null]) {
        return NULL;
    }
    NSDictionary* uCategories = [self clearDictionaryFromNull:[userCategories mutableCopy]];
    MIUserCategories* userCategoriesNew = [[MIUserCategories alloc] initWithDictionary:uCategories];
    return userCategoriesNew;
}

-(MISessionParameters*)prepareSessionParameters:(NSDictionary*) sessionParamters {
    if (sessionParamters == NULL || sessionParamters == [NSNull null]) {
        return NULL;
    }
    NSDictionary* sParameters = [self clearDictionaryFromNull:[sessionParamters mutableCopy]];
    MISessionParameters* sessionParamtersObject = [[MISessionParameters alloc] initWithParameters:sParameters];
    return sessionParamtersObject;
}

-(MIEcommerceParameters*)prepareEcommerceParameters:(NSDictionary*) ecommerceParamters {
    if (ecommerceParamters == NULL || ecommerceParamters == [NSNull null]) {
        return NULL;
    }
    NSDictionary* eParameters = [self clearDictionaryFromNull:[ecommerceParamters mutableCopy]];
    MIEcommerceParameters* ecommerceParamtersObject = [[MIEcommerceParameters alloc] initWithDictionary:eParameters];
    return ecommerceParamtersObject;
}

-(MICampaignParameters*)prepareCampaignParameters:(NSDictionary*) campaignParamters {
    if (campaignParamters == NULL || campaignParamters == [NSNull null]) {
        return NULL;
    }
    NSDictionary* cParameters = [self clearDictionaryFromNull:[campaignParamters mutableCopy]];
    MICampaignParameters* campaignParamtersObject = [[MICampaignParameters alloc] initWithDictionary:cParameters];
    return campaignParamtersObject;
}

- (NSMutableDictionary *)clearDictionaryFromNull:(NSMutableDictionary *)dictionary {
  NSArray *keysToRemove = [NSMutableArray array];

    for (NSString *key in dictionary.allKeys) {
        if ([dictionary[key] isKindOfClass:[NSDictionary class]]) {
            // Recursively clear nested dictionaries
            NSMutableDictionary *nestedDict = [self clearDictionaryFromNull:dictionary[key]];
            if (nestedDict == nil) {
                keysToRemove = [keysToRemove arrayByAddingObject:key];
            } else {
                dictionary[key] = nestedDict;
            }
        } else if ([dictionary[key] isEqual:[NSNull null]]) {
            keysToRemove = [keysToRemove arrayByAddingObject:key];
        }
    }
  if([keysToRemove count] > 0) {
    [dictionary removeObjectsForKeys:keysToRemove];
  }

    return dictionary;
}

@end
