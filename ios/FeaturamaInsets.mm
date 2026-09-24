#import "FeaturamaInsets.h"

#if TARGET_OS_IPHONE
#import <UIKit/UIKit.h>
#endif

#ifdef RCT_NEW_ARCH_ENABLED
#import <FeaturamaInsetsSpec/FeaturamaInsetsSpec.h>
#endif

@implementation FeaturamaInsets {
  NSDictionary *_cachedInsets;
}

RCT_EXPORT_MODULE(FeaturamaInsets)

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

- (instancetype)init
{
  self = [super init];
  if (self) {
    _cachedInsets = [self readSafeAreaInsets];
  }
  return self;
}

#pragma mark - Window Helpers

+ (UIWindow *)keyWindow
{
#if TARGET_OS_IPHONE
  if (@available(iOS 15.0, *)) {
    for (UIScene *scene in UIApplication.sharedApplication.connectedScenes) {
      if ([scene isKindOfClass:[UIWindowScene class]]) {
        UIWindow *kw = ((UIWindowScene *)scene).keyWindow;
        if (kw) return kw;
      }
    }
  }

  for (UIScene *scene in UIApplication.sharedApplication.connectedScenes) {
    if (scene.activationState == UISceneActivationStateForegroundActive &&
        [scene isKindOfClass:[UIWindowScene class]]) {
      for (UIWindow *w in ((UIWindowScene *)scene).windows) {
        if (w.isKeyWindow) return w;
      }
    }
  }
#endif
  return nil;
}

#pragma mark - Inset Reading

- (NSDictionary *)readSafeAreaInsets
{
#if TARGET_OS_IPHONE
  UIWindow *window = [FeaturamaInsets keyWindow];
  if (!window) {
    return @{@"top": @(0), @"right": @(0), @"bottom": @(0), @"left": @(0)};
  }

  UIEdgeInsets insets = window.safeAreaInsets;
  return @{
    @"top": @(insets.top),
    @"right": @(insets.right),
    @"bottom": @(insets.bottom),
    @"left": @(insets.left),
  };
#else
  return @{@"top": @(0), @"right": @(0), @"bottom": @(0), @"left": @(0)};
#endif
}

#pragma mark - TurboModule Methods

RCT_EXPORT_SYNCHRONOUS_TYPED_METHOD(NSDictionary *, getSafeAreaInsets)
{
  // Runs on JS thread — return cached values (populated on main thread during init)
  return _cachedInsets ?: @{@"top": @(0), @"right": @(0), @"bottom": @(0), @"left": @(0)};
}

- (NSDictionary *)getConstants
{
  // Runs on main thread (requiresMainQueueSetup = YES) during module init
  return @{@"initialInsets": _cachedInsets ?: @{@"top": @(0), @"right": @(0), @"bottom": @(0), @"left": @(0)}};
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeFeaturamaInsetsSpecJSI>(params);
}
#endif

@end
