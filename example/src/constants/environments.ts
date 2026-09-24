// Environment Configuration

import Constants from 'expo-constants';
import { Platform } from 'react-native';

// App Version Constants - dynamically read from expo config
export const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';
export const APP_BUILD_NUMBER = Platform.select({
  ios: Constants.expoConfig?.ios?.buildNumber ?? '1',
  android: Constants.expoConfig?.android?.versionCode?.toString() ?? '1',
  default: '1',
});
export const APP_VERSION_DISPLAY = `${APP_VERSION} (${APP_BUILD_NUMBER})`;
export const ENVIRONMENT = __DEV__ ? 'Development' : 'Production';

export type EnvironmentName = 'development' | 'production';

export interface EnvironmentConfig {
  name: EnvironmentName;
  apiBaseUrl: string;
  isDebug: boolean;
}

const environments: Record<EnvironmentName, EnvironmentConfig> = {
  development: {
    name: 'development',
    apiBaseUrl: 'http://localhost:3000',
    isDebug: true,
  },
  production: {
    name: 'production',
    apiBaseUrl: 'https://api.yourcompany.com',
    isDebug: false,
  },
};

export const getCurrentEnvironment = (): EnvironmentConfig => {
  return __DEV__ ? environments.development : environments.production;
};

export const isDebugMode = (): boolean => {
  return __DEV__;
};

export const getApiBaseUrl = (): string => {
  return getCurrentEnvironment().apiBaseUrl;
};
