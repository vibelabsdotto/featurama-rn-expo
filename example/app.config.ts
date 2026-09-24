import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'FT Expo',
  slug: 'featurama-tester',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  scheme: 'featurama-tester',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#f8f8f7',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.featurama.tester',
    buildNumber: '1',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#f8f8f7',
    },
    package: 'com.featurama.tester',
    versionCode: 1,
    edgeToEdgeEnabled: true,
    softwareKeyboardLayoutMode: 'pan',
  },
  plugins: [
    'expo-router',
    'expo-build-properties',
    [
      'expo-localization',
      {
        supportedLocales: {
          ios: ['en', 'de'],
          android: ['en', 'de'],
        },
      },
    ],
    [
      'expo-splash-screen',
      {
        backgroundColor: '#f8f8f7',
        dark: {
          backgroundColor: '#191919',
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
  },
});
