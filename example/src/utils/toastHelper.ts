// Toast Helper with custom styling
// Uses react-native-toast-message
// Supports onPress for navigation to help pages

import Toast from 'react-native-toast-message';
import { Linking } from 'react-native';

interface ToastOptions {
  duration?: number;
  onPress?: () => void;
  /** URL to open when tapped (alternative to onPress) */
  helpUrl?: string;
}

/**
 * Opens a URL in the browser
 */
const openHelpUrl = async (url: string) => {
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      console.warn('[toast] Cannot open URL:', url);
    }
  } catch (error) {
    console.error('[toast] Error opening URL:', error);
  }
};

export const toast = {
  /**
   * Shows an error toast
   * @param message - The error message
   * @param options - Options including helpUrl for tap-to-help
   */
  error: (message: string, options?: ToastOptions) => {
    const hasHelpAction = options?.helpUrl || options?.onPress;

    Toast.show({
      type: 'error',
      text1: message,
      text2: options?.helpUrl ? 'Tap for help' : undefined,
      visibilityTime: options?.duration ?? (hasHelpAction ? 6000 : 4000),
      onPress: () => {
        Toast.hide();
        if (options?.onPress) {
          options.onPress();
        } else if (options?.helpUrl) {
          openHelpUrl(options.helpUrl);
        }
      },
    });
  },

  /**
   * Shows a success toast
   */
  success: (message: string, options?: ToastOptions) => {
    Toast.show({
      type: 'success',
      text1: message,
      visibilityTime: options?.duration ?? 3000,
      onPress: () => {
        Toast.hide();
        options?.onPress?.();
      },
    });
  },

  /**
   * Shows an info toast
   */
  info: (message: string, options?: ToastOptions) => {
    Toast.show({
      type: 'info',
      text1: message,
      visibilityTime: options?.duration ?? 3000,
      onPress: () => {
        Toast.hide();
        options?.onPress?.();
      },
    });
  },

  /**
   * Shows a warning toast
   */
  warning: (message: string, options?: ToastOptions) => {
    Toast.show({
      type: 'warning',
      text1: message,
      visibilityTime: options?.duration ?? 4000,
      onPress: () => {
        Toast.hide();
        options?.onPress?.();
      },
    });
  },
};
