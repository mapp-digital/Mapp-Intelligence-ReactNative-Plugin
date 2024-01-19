
#ifdef RCT_NEW_ARCH_ENABLED
#import "RNMappinteligencePluginSpec.h"

@interface MappinteligencePlugin : NSObject <NativeMappinteligencePluginSpec>
#else
#import <React/RCTBridgeModule.h>

@interface MappinteligencePlugin : NSObject <RCTBridgeModule>
#endif

@end
