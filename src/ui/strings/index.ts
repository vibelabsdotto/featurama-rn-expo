import type { FeaturamaStrings } from './en';
import { defaultStrings } from './en';
import { strings as de } from './de';
import { strings as fr } from './fr';
import { strings as es } from './es';
import { strings as pt } from './pt';
import { strings as it } from './it';
import { strings as nl } from './nl';
import { strings as pl } from './pl';
import { strings as ja } from './ja';
import { strings as ko } from './ko';
import { strings as zh } from './zh';
import type { SupportedLocale } from '../utils/locale';

const localeMap: Record<SupportedLocale, FeaturamaStrings> = {
  en: defaultStrings,
  de,
  fr,
  es,
  pt,
  it,
  nl,
  pl,
  ja,
  ko,
  zh,
};

export function getStringsForLocale(locale: SupportedLocale): FeaturamaStrings {
  return localeMap[locale] ?? defaultStrings;
}

export type { FeaturamaStrings };
export { defaultStrings };
