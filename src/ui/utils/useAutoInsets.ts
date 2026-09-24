/* eslint-disable @typescript-eslint/no-require-imports */
import { Platform } from 'react-native';

const ZERO = { top: 0, right: 0, bottom: 0, left: 0 };

function getDetectedInsets(): { top: number; right: number; bottom: number; left: number } {
  if (Platform.OS === 'web') return ZERO;
  try {
    const mod = require('../../NativeFeaturamaInsets').default;
    if (!mod) return ZERO;
    return mod.getConstants().initialInsets;
  } catch {
    return ZERO;
  }
}

// Read insets synchronously at module load — getConstants() is sync via JSI
const detected = getDetectedInsets();

export function useAutoInsets(
  overrideTop?: number,
  overrideBottom?: number,
): { top: number; bottom: number } {
  return {
    top: overrideTop ?? detected.top,
    bottom: overrideBottom ?? detected.bottom,
  };
}
