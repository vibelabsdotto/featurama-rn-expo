import { Platform, NativeModules } from 'react-native';

export type SupportedLocale =
  | 'en' | 'de' | 'fr' | 'es' | 'pt'
  | 'it' | 'nl' | 'pl' | 'ja' | 'ko' | 'zh';

const SUPPORTED_LOCALES = new Set<string>([
  'en', 'de', 'fr', 'es', 'pt', 'it', 'nl', 'pl', 'ja', 'ko', 'zh',
]);

/**
 * Detect the device language using a tiered fallback:
 * 1. expo-localization (Expo users)
 * 2. react-native-localize (bare RN users who installed it)
 * 3. NativeModules (built-in, no extra deps)
 * 4. Fallback: 'en'
 */
export function getDeviceLocale(): SupportedLocale {
  let raw: string | undefined;

  // Tier 1: expo-localization
  try {
    const expoLoc = require('expo-localization');
    const locales = expoLoc.getLocales?.();
    if (locales?.[0]?.languageCode) {
      raw = locales[0].languageCode;
    }
  } catch {
    // Not available
  }

  // Tier 2: react-native-localize
  if (!raw) {
    try {
      const rnLocalize = require('react-native-localize');
      const locales = rnLocalize.getLocales?.();
      if (locales?.[0]?.languageCode) {
        raw = locales[0].languageCode;
      }
    } catch {
      // Not available
    }
  }

  // Tier 3: NativeModules
  if (!raw) {
    try {
      if (Platform.OS === 'ios') {
        const settings = NativeModules.SettingsManager?.settings;
        raw = settings?.AppleLanguages?.[0] ?? settings?.AppleLocale;
      } else {
        raw = NativeModules.I18nManager?.localeIdentifier;
      }
    } catch {
      // NativeModules access failed
    }
  }

  // Normalize "pt-BR" / "zh-Hans" / "en_US" → language code
  if (raw) {
    const code = raw.split(/[-_]/)[0]?.toLowerCase();
    if (code && SUPPORTED_LOCALES.has(code)) {
      return code as SupportedLocale;
    }
  }

  return 'en';
}
