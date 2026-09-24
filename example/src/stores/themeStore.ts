// Theme Store - Zustand state management for app theme

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';
import { ThemeMode } from '@apptypes/enums';
import { Colors, ThemeColors } from '@constants/colors';

interface ThemeState {
  // Settings
  themeMode: ThemeMode;

  // Computed
  isDark: boolean;
  colors: ThemeColors;

  // Actions
  setThemeMode: (mode: ThemeMode) => void;
  updateSystemTheme: () => void;
}

const getSystemColorScheme = (): 'light' | 'dark' => {
  const scheme = Appearance.getColorScheme();
  return scheme === 'dark' ? 'dark' : 'light';
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeMode: ThemeMode.System,

      // Will be computed based on themeMode
      isDark: getSystemColorScheme() === 'dark',
      colors: Colors.light,

      setThemeMode: (mode) => {
        let isDark: boolean;

        switch (mode) {
          case ThemeMode.Dark:
            isDark = true;
            break;
          case ThemeMode.Light:
            isDark = false;
            break;
          case ThemeMode.System:
          default:
            isDark = getSystemColorScheme() === 'dark';
            break;
        }

        set({
          themeMode: mode,
          isDark,
          colors: isDark ? Colors.dark : Colors.light,
        });
      },

      updateSystemTheme: () => {
        const { themeMode } = get();
        if (themeMode === ThemeMode.System) {
          const isDark = getSystemColorScheme() === 'dark';
          set({
            isDark,
            colors: isDark ? Colors.dark : Colors.light,
          });
        }
      },
    }),
    {
      name: 'app-theme-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        themeMode: state.themeMode,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Recompute colors after rehydration
          let isDark: boolean;
          switch (state.themeMode) {
            case ThemeMode.Dark:
              isDark = true;
              break;
            case ThemeMode.Light:
              isDark = false;
              break;
            default:
              isDark = getSystemColorScheme() === 'dark';
          }
          state.isDark = isDark;
          state.colors = isDark ? Colors.dark : Colors.light;
        }
      },
    }
  )
);
