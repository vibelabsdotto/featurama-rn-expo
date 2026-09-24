import { createContext, useContext } from 'react';
import type { FeaturamaTheme } from './types';

export const ThemeContext = createContext<FeaturamaTheme | null>(null);

export function useTheme(): FeaturamaTheme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeContext.Provider');
  }
  return theme;
}
