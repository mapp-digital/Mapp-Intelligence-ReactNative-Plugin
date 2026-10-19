
#ifdef RCT_NEW_ARCH_ENABLED
#import <MappinteligencePlugin/MappinteligencePlugin.h>

@interface MappinteligencePlugin : NSObject <NativeMappintelligencePluginSpec>
#else
#import <React/RCTBridgeModule.h>

@interface MappinteligencePlugin : NSObject <RCTBridgeModule>
#endif
@end
