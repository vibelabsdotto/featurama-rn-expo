import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'FT Expo',
  slug: 'featurama-tester',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  scheme: 'featurama-tester',

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
    softwareKeyboardLayoutMode: 'pan',
  },
  plugins: [
    'expo-router',
    'expo-status-bar',
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
        image: './assets/splash-icon.png',
        resizeMode: 'contain',
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
