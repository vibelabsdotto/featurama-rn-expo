// App configuration constants

export const AppConfig = {
  // App Info
  appName: 'ExpoBoilerplate',
  appDisplayName: 'Expo Boilerplate',

  // Storage keys for AsyncStorage
  storageKeys: {
    user: 'app_user',
    theme: 'app_theme',
    preferences: 'app_preferences',
    authToken: 'app_auth_token',
    lastSeenChangelog: 'app_last_seen_changelog',
  },

  // API Configuration
  api: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
  },

  // Feature Flags
  features: {
    enableChangelog: true,
    enableAnalytics: false,
  },
};
