import type { FeaturamaTheme } from './theme/types';

export interface FeatureRequestsScreenProps {
  colorScheme: 'light' | 'dark';
  accentColor: string;
  onClose?: () => void;
  safeAreaTop?: number;
  safeAreaBottom?: number;
  keyboardVerticalOffset?: number;
  /**
   * Override any theme color generated from accentColor/colorScheme.
   * Partial — only the keys you provide will be overridden.
   *
   * @example
   * ```tsx
   * <FeatureRequestsScreen
   *   colorScheme="dark"
   *   accentColor="#4cb211"
   *   theme={{ background: '#1a1a2e', card: '#16213e' }}
   * />
   * ```
   */
  theme?: Partial<FeaturamaTheme>;
}
