// i18n configuration using expo-localization + i18n-js

import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import { en } from './en';
import { de } from './de';

// Create i18n instance with translations
const i18n = new I18n({
  en,
  de,
});

// Get device locale and set as default
const deviceLocales = getLocales();
const deviceLanguage = deviceLocales[0]?.languageCode ?? 'en';

// Set locale based on device language (fallback to 'en' if not supported)
i18n.locale = ['en', 'de'].includes(deviceLanguage) ? deviceLanguage : 'en';

// Enable fallback to default locale
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export default i18n;
