// i18n Localization System
// Using expo-localization + i18n-js for automatic device language detection
// and per-app language selection via iOS/Android system settings

import i18n from './i18n';
import { Translations } from './en';

export type LanguageCode = 'en' | 'de';

/**
 * Translate a key to the current locale
 * @param key - Dot-notation key (e.g., 'auth.login')
 * @param params - Optional parameters for interpolation
 */
export const t = (key: string, params?: Record<string, string | number>): string => {
  return i18n.t(key, params);
};

/**
 * Get the current locale
 */
export const locale = (): LanguageCode => {
  return i18n.locale as LanguageCode;
};

/**
 * Set the locale manually (optional, normally handled by system settings)
 * @param newLocale - The locale to set
 */
export const setLocale = (newLocale: LanguageCode): void => {
  i18n.locale = newLocale;
};

/**
 * Hook for translations (for components that need reactive updates)
 * Since i18n-js doesn't have built-in React reactivity, this provides
 * a consistent API. For most cases, use t() directly.
 */
export const useTranslation = () => {
  return {
    t,
    locale: locale(),
    setLocale,
  };
};

// Re-export types
export type { Translations };
