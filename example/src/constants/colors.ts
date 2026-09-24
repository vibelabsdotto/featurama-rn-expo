// App Color System - shadcn-aligned Light/Dark Theme Support
// Accent Color: Featurama Blue hsl(199 84% 46%) → #1395d6

export const Colors = {
  light: {
    // Backgrounds
    background: '#ffffff',
    card: '#f9f8f7',
    primary: '#ffffff',
    secondary: '#f9f8f7',
    muted: '#f5f5f5',

    // Text
    text: '#0a0a0a',
    textSecondary: '#737373',
    foreground: '#0a0a0a',
    mutedForeground: '#737373',

    // Brand/Accent - Featurama Blue
    accent: '#1395d6',
    accentLight: '#1395d620',
    accentForeground: '#ffffff',

    // Status Colors
    success: '#22c55e',
    error: '#ef4444',
    destructive: '#ef4444',
    warning: '#f59e0b',
    warningLight: '#fef3c7',

    // Grays
    gray100: '#f5f5f5',
    gray200: '#e5e5e5',
    gray300: '#a3a3a3',

    // Borders & Inputs
    border: '#e5e5e5',
    input: '#e5e5e5',
    ring: '#0a0a0a',

    // Navigation
    tabBar: '#ffffff',
    tabBarInactive: '#737373',
  },
  dark: {
    // Backgrounds
    background: '#191919',
    card: '#202020',
    primary: '#191919',
    secondary: '#2a2a2a',
    muted: '#2a2a2a',

    // Text
    text: '#fafafa',
    textSecondary: '#a3a3a3',
    foreground: '#fafafa',
    mutedForeground: '#a3a3a3',

    // Brand/Accent - Featurama Blue (lighter for dark mode)
    accent: '#3ab0eb',
    accentLight: '#1395d630',
    accentForeground: '#ffffff',

    // Status Colors
    success: '#22c55e',
    error: '#ef4444',
    destructive: '#7f1d1d',
    warning: '#f59e0b',
    warningLight: '#422006',

    // Grays
    gray100: '#262626',
    gray200: '#404040',
    gray300: '#737373',

    // Borders & Inputs
    border: '#262626',
    input: '#262626',
    ring: '#d4d4d4',

    // Navigation
    tabBar: '#191919',
    tabBarInactive: '#737373',
  },
};

export type ThemeColors = typeof Colors.light;
export type ColorScheme = 'light' | 'dark';
