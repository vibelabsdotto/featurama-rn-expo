import type { JSX } from 'react';
import { createContext, useMemo, type ReactNode } from 'react';
import { FeaturamaClient } from '../client';
import type { FeaturamaConfig, FeaturamaContextValue } from '../types';

export const FeaturamaContext = createContext<FeaturamaContextValue | null>(null);

export interface FeaturamaProviderProps {
  /**
   * Configuration for the Featurama client
   */
  config: FeaturamaConfig;
  /**
   * Child components that will have access to the Featurama context
   */
  children: ReactNode;
}

/**
 * Provider component that initializes the Featurama client and makes it available
 * to all child components via React context.
 *
 * @example
 * ```tsx
 * <FeaturamaProvider config={{ apiKey: 'fm_live_...' }}>
 *   <App />
 * </FeaturamaProvider>
 * ```
 */
export function FeaturamaProvider({
  config,
  children,
}: FeaturamaProviderProps): JSX.Element {
  const client = useMemo(
    () => new FeaturamaClient(config),
    [config.apiKey, config.baseUrl, config.timeout, config.appVersion, config.appBuild]
  );

  const value = useMemo<FeaturamaContextValue>(
    () => ({
      client,
      isInitialized: true,
    }),
    [client]
  );

  return (
    <FeaturamaContext.Provider value={value}>
      {children}
    </FeaturamaContext.Provider>
  );
}
