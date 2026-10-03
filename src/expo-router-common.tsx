import type { JSX } from 'react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { BackHandler, Pressable, View } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { FeatureRequestsScreen } from './ui/FeatureRequestsScreen';
import { createTheme } from './ui/theme/createTheme';
import { getStringsForLocale } from './ui/strings';
import { getDeviceLocale } from './ui/utils/locale';
import type { FeatureRequestsScreenProps, FeaturamaNavigationState } from './ui/types';

/**
 * Use inside a route owned by Expo Router's native Stack. Import this entry point
 * only in Expo Router apps; the package's default entry has no router dependency.
 * For RN Modal, Tabs, or other navigators, use FeatureRequestsScreen instead.
 */
export function ExpoRouterFeatureRequestsScreenBase(
  { usePreventRemove, ...props }: FeatureRequestsScreenProps & {
    usePreventRemove: (preventRemove: boolean, callback: () => void) => void;
  }
): JSX.Element {
  const router = useRouter();
  const navigation = useNavigation();
  const isStack = navigation.getState()?.type === 'stack';
  const locale = useMemo(() => props.locale ?? getDeviceLocale(), [props.locale]);
  const strings = useMemo(() => getStringsForLocale(locale), [locale]);
  const [view, setView] = useState<FeaturamaNavigationState | null>(null);
  const theme = useMemo(() => ({ ...createTheme(props.accentColor, props.colorScheme), ...props.theme }),
    [props.accentColor, props.colorScheme, props.theme]);
  const onClose = useCallback(() => {
    if (props.onClose) props.onClose();
    else if (router.canDismiss()) router.dismiss();
    else if (router.canGoBack()) router.back();
  }, [props.onClose, router]);

  // Not a Stack: retain the SDK header, without overriding the host navigator.
  const nativeHeader = isStack;
  const onNavigationChange = useCallback((next: FeaturamaNavigationState) => setView(next), []);
  const isChild = nativeHeader && view != null && view.screen !== 'list';

  // Intercept native modal swipe/back while on an internal SDK view. The route
  // remains mounted; a create draft is never dropped by a native dismiss.
  usePreventRemove(Boolean(isChild), () => view?.onBack());

  useLayoutEffect(() => {
    if (!nativeHeader) return;
    const child = view?.screen !== 'list' && view != null;
    const action = child ? view.onBack : onClose;
    navigation.setOptions({
      headerShown: true,
      title: view?.title ?? strings.title,
      headerStyle: { backgroundColor: theme.background },
      headerTintColor: theme.text,
      // PreventRemove sends native dismiss/back gestures to the internal view
      // first; on the list the host route can be dismissed as usual.
      gestureEnabled: true,
      headerBackVisible: false,
      // Native Stack already centers its custom header view with the title.
      headerLeft: () => (
        <Pressable onPress={action} accessibilityRole="button" accessibilityLabel={child ? strings.back : strings.close}
          hitSlop={4}
          style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
            {child ? (
              <View style={{ width: 11, height: 11, marginLeft: 4, borderLeftWidth: 2,
                borderBottomWidth: 2, borderColor: theme.text, transform: [{ rotate: '45deg' }] }} />
            ) : (
              <>
                <View style={{ position: 'absolute', width: 16, height: 2,
                  backgroundColor: theme.text, transform: [{ rotate: '45deg' }] }} />
                <View style={{ position: 'absolute', width: 16, height: 2,
                  backgroundColor: theme.text, transform: [{ rotate: '-45deg' }] }} />
              </>
            )}
          </View>
        </Pressable>
      ),
    });
  }, [nativeHeader, navigation, view, onClose, theme, strings]);

  useEffect(() => {
    if (!isChild) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      view?.onBack();
      return true;
    });
    return () => subscription.remove();
  }, [isChild, view]);

  return (
    <FeatureRequestsScreen
      {...props}
      locale={locale}
      onClose={onClose}
      nativeHeader={nativeHeader}
      onNavigationChange={nativeHeader ? onNavigationChange : undefined}
      safeAreaTop={nativeHeader ? 0 : props.safeAreaTop}
    />
  );
}