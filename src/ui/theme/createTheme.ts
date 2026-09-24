import type { FeaturamaTheme } from './types';

function hexToHsl(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 50];

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };

  return `#${f(0)}${f(8)}${f(4)}`;
}

function relativeLuminance(hex: string): number {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return 0;

  const [r, g, b] = [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ].map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function createTheme(
  accentColor: string,
  colorScheme: 'light' | 'dark'
): FeaturamaTheme {
  const [h, s] = hexToHsl(accentColor);
  const isDark = colorScheme === 'dark';

  const accentLight = isDark
    ? hslToHex(h, Math.min(s, 30), 20)
    : hslToHex(h, Math.min(s, 40), 92);

  const accentForeground =
    relativeLuminance(accentColor) > 0.4 ? '#000000' : '#ffffff';

  if (isDark) {
    return {
      background: '#000000',
      card: '#1c1c1e',
      secondary: '#2c2c2e',
      text: '#ffffff',
      textSecondary: '#8e8e93',
      accent: accentColor,
      accentLight,
      accentForeground,
      border: '#38383a',
      borderAccent: accentColor,
      gray100: '#1c1c1e',
      warning: '#F59E0B',
      warningLight: '#422006',
      warningText: '#FCD34D',
    };
  }

  return {
    background: '#f2f2f7',
    card: '#ffffff',
    secondary: '#f2f2f7',
    text: '#000000',
    textSecondary: '#8e8e93',
    accent: accentColor,
    accentLight,
    accentForeground,
    border: '#e5e5ea',
    borderAccent: accentColor,
    gray100: '#e5e5ea',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    warningText: '#92400E',
  };
}
