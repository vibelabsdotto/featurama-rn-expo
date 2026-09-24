import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export type Insets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export interface Spec extends TurboModule {
  // Synchronous via JSI — no Promise, no flicker
  getSafeAreaInsets(): Insets;

  // Initial values read on main thread during module init
  getConstants(): { initialInsets: Insets };
}

export default TurboModuleRegistry.get<Spec>('FeaturamaInsets');
