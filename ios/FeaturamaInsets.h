#ifdef RCT_NEW_ARCH_ENABLED
#import <FeaturamaInsetsSpec/FeaturamaInsetsSpec.h>

@interface FeaturamaInsets : NSObject <NativeFeaturamaInsetsSpec>
#else
#import <React/RCTBridgeModule.h>

@interface FeaturamaInsets : NSObject <RCTBridgeModule>
#endif

@end
