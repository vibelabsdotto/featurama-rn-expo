import type { FeaturamaConfig } from '@vibelabsdotto/featurama-rn-expo';

export const FEATURAMA_CONFIG: FeaturamaConfig = {
  apiKey: process.env.EXPO_PUBLIC_FEATURAMA_API_KEY ?? '',
  baseUrl: process.env.EXPO_PUBLIC_FEATURAMA_API_URL ?? 'https://newapi.featurama.app',
};
