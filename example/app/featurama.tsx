import { FeaturamaProvider } from '@vibelabsdotto/featurama-rn-expo';
import { ExpoRouterFeatureRequestsScreen } from '@vibelabsdotto/featurama-rn-expo/expo-router';
import { useThemeStore } from '@stores/themeStore';
import { FEATURAMA_CONFIG } from '@/config';

export default function FeaturamaRoute() {
  const isDark = useThemeStore((state) => state.isDark);
  return (
    <FeaturamaProvider config={{ apiKey: FEATURAMA_CONFIG.apiKey, baseUrl: FEATURAMA_CONFIG.baseUrl }}>
      <ExpoRouterFeatureRequestsScreen
        colorScheme={isDark ? 'dark' : 'light'}
        accentColor="#1395d6"
      />
    </FeaturamaProvider>
  );
}
