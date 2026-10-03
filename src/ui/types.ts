import type { FeaturamaTheme } from './theme/types';
import type { SupportedLocale } from './utils/locale';

export interface FeatureRequestsScreenProps {
  colorScheme: 'light' | 'dark';
  accentColor: string;
  /** App-selected language. When omitted, the SDK detects the device language. */
  locale?: SupportedLocale;
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

export interface FeatureRequestsScreenInternalProps extends FeatureRequestsScreenProps {
  nativeHeader?: boolean;
  onNavigationChange?: (state: FeaturamaNavigationState) => void;
}

export interface FeaturamaNavigationState {
  title: string;
  screen: 'list' | 'create' | 'detail';
  onBack: () => void;
}
