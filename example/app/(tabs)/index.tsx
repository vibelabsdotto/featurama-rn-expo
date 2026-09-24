// Modal - Featurama SDK Modal Demo

import { useState } from 'react';
import { View, Modal, Platform, StyleSheet } from 'react-native';
import { useThemeStore } from '@stores/themeStore';
import {
  FeaturamaProvider,
  FeatureRequestsScreen,
} from '@vibelabsdotto/featurama-rn-expo';
import { FEATURAMA_CONFIG } from '@/config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenLayout } from '@components/common/ScreenLayout';
import { Button } from '@components/common/Button';

export default function ModalScreen() {
  const [visible, setVisible] = useState(false);
  const isDark = useThemeStore((state) => state.isDark);
  const insets = useSafeAreaInsets();

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <Button
          title="Feature Requests"
          onPress={() => setVisible(true)}
          variant="primary"
          size="large"
        />
      </View>

      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setVisible(false)}
      >
        <FeaturamaProvider
          config={{
            apiKey: FEATURAMA_CONFIG.apiKey,
            baseUrl: FEATURAMA_CONFIG.baseUrl,
          }}
        >
          <FeatureRequestsScreen
            colorScheme={isDark ? 'dark' : 'light'}
            accentColor="#1395d6"
            safeAreaTop={Platform.OS === 'android' ? insets.top : 0}
            onClose={() => setVisible(false)}
            theme={{
              background: isDark ? '#191919' : '#ffffff',
              card: isDark ? '#202020' : '#fefbf8',
              secondary: isDark ? '#2a2a2a' : '#f5f5f5',
              accent: '#1395d6',
              accentLight: isDark ? '#1395d630' : '#1395d620',
              accentForeground: '#ffffff',
              border: isDark ? '#262626' : '#e5e5e5',
              borderAccent: '#1395d6',
              gray100: isDark ? '#262626' : '#f5f5f5',
            }}
          />
        </FeaturamaProvider>
      </Modal>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
});
