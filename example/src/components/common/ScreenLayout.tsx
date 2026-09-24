// Screen Layout - Base layout for all screens
// Uses useSafeAreaInsets for reliable safe area handling on iOS and Android

import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControlProps, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeStore } from '@stores/themeStore';

interface ScreenLayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
  /** @deprecated Use safeAreaTop/safeAreaBottom instead */
  safeArea?: boolean;
  /** Apply safe area padding at top (default: true) */
  safeAreaTop?: boolean;
  /** Apply safe area padding at bottom (default: false, since tab bar handles it) */
  safeAreaBottom?: boolean;
  /** Apply safe area only on Android (for modals) */
  androidOnly?: boolean;
  padding?: boolean;
  /** Extra padding on top in addition to safe area */
  extraPaddingTop?: number;
  /** Extra padding at bottom in addition to safe area */
  extraPaddingBottom?: number;
  refreshControl?: React.ReactElement<RefreshControlProps>;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  scrollable = false,
  safeArea = true,
  safeAreaTop,
  safeAreaBottom,
  androidOnly = false,
  padding = true,
  extraPaddingTop = 0,
  extraPaddingBottom = 0,
  refreshControl,
}) => {
  const colors = useThemeStore((state) => state.colors);
  const insets = useSafeAreaInsets();

  // If androidOnly, only apply safe area on Android
  const isAndroid = Platform.OS === 'android';
  const shouldApplySafeArea = androidOnly ? isAndroid : true;

  // Backwards compatibility: if safeArea is set, use it for safeAreaTop
  const applyTopSafeArea = (safeAreaTop ?? safeArea) && shouldApplySafeArea;
  // Bottom safe area is false by default since tab bar handles it
  const applyBottomSafeArea = (safeAreaBottom ?? false) && shouldApplySafeArea;

  const topPadding = (applyTopSafeArea ? insets.top : 0) + extraPaddingTop;
  const bottomPadding = (applyBottomSafeArea ? insets.bottom : 0) + extraPaddingBottom;

  const containerStyle = [
    styles.container,
    {
      backgroundColor: colors.background,
      paddingTop: topPadding,
      paddingBottom: bottomPadding,
    },
  ];

  return (
    <View style={containerStyle}>
      {scrollable ? (
        <ScrollView
          style={[styles.content, padding && styles.padding]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={refreshControl}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, padding && styles.padding, styles.flex]}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  padding: {
    paddingHorizontal: 6,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
