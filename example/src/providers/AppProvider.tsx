// App Provider - Initializes app state (minimal for SDK testing)

import { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Appearance } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useThemeStore } from '@stores/themeStore';
import { Colors } from '@constants/colors';

SplashScreen.preventAutoHideAsync();

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const updateSystemTheme = useThemeStore((state) => state.updateSystemTheme);

  useEffect(() => {
    const initialize = async () => {
      setIsReady(true);
      await SplashScreen.hideAsync();
    };

    initialize();

    const subscription = Appearance.addChangeListener(() => {
      updateSystemTheme();
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.accent} />
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
});
