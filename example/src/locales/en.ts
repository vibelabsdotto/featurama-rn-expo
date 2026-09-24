// English translations (default)

export const en = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    ok: 'OK',
    yes: 'Yes',
    no: 'No',
    retry: 'Retry',
    close: 'Close',
  },

  auth: {
    login: 'Login',
    logout: 'Logout',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    resetPassword: 'Reset Password',
    sendResetLink: 'Send Reset Link',
    welcomeBack: 'Welcome back',
    loginSubtitle: 'Sign in with your credentials',
    resetPasswordTitle: 'Reset Password',
    resetPasswordDescription: 'Enter your email address and we will send you a link to reset your password.',
    resetPasswordSuccess: 'Password reset email sent',
    resetPasswordSuccessMessage: 'A password reset email has been sent. Please check your inbox.',
    invalidEmail: 'Please enter a valid email',
    invalidPassword: 'Password must be at least 6 characters',
    loginFailed: 'Login failed',
    logoutConfirm: 'Are you sure you want to logout?',
  },

  settings: {
    title: 'Settings',
    appearance: 'Appearance',
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
    account: 'Account',
    changePassword: 'Change Password',
    changePasswordDescription: 'Send email to reset',
    notifications: 'Notifications',
    language: 'Language',
    about: 'About',
    version: 'Version',
    appInfo: 'App Info',
  },

  tabs: {
    home: 'Home',
    settings: 'Settings',
  },

  home: {
    title: 'Home',
    welcome: 'Welcome',
  },

  update: {
    required: 'Update Required',
    available: 'Update Available',
    updateApp: 'Update App',
    mandatoryDescription: 'This version of the app is no longer supported. Please update the app to continue.',
    optionalDescription: 'A new version of the app is available. We recommend updating to get all new features and improvements.',
    installedVersion: 'Installed:',
    latestVersion: 'Latest:',
    mandatoryNote: 'This update is required to continue using the app.',
    releaseNotes: 'Release Notes',
  },

  connection: {
    noConnection: 'No Internet Connection',
    noConnectionDescription: 'Please check your internet connection and try again.',
    tryAgain: 'Try Again',
    troubleshooting: 'Troubleshooting tips:',
    tip1: 'Check your WiFi or mobile data connection',
    tip2: 'Disable airplane mode if enabled',
    tip3: 'Restart your device',
  },

  changelog: {
    whatsNew: "What's New",
    noChanges: 'No changes documented.',
    dismiss: 'Got it',
  },

  onboarding: {
    welcome: {
      title: 'Welcome to App',
      subtitle: 'Your journey starts here. Discover all the amazing features we have prepared for you.',
      continue: 'Continue',
    },
    features: {
      title: 'Discover Features',
      feature1Title: 'Lightning Fast',
      feature1: 'Experience blazing fast performance with our optimized architecture.',
      feature2Title: 'Secure by Design',
      feature2: 'Your data is protected with industry-leading security standards.',
      feature3Title: 'Available Everywhere',
      feature3: 'Access your content from any device, anytime, anywhere.',
      continue: 'Continue',
    },
    permissions: {
      title: 'Stay Updated',
      subtitle: 'Enable notifications to never miss important updates and stay connected.',
      enable: 'Enable Notifications',
      skip: 'Maybe Later',
    },
  },

  errors: {
    generic: 'An error occurred',
    networkError: 'Network error. Please check your connection.',
    serverError: 'Server error. Please try again later.',
    sessionExpired: 'Your session has expired. Please login again.',
  },
};

export type Translations = typeof en;
