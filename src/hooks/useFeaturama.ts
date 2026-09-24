import { useContext } from 'react';
import { FeaturamaContext } from '../context/FeaturamaProvider';
import type { FeaturamaContextValue } from '../types';

/**
 * Hook to access the Featurama client from context.
 * Must be used within a FeaturamaProvider.
 *
 * @returns The Featurama context containing the client and initialization status
 * @throws Error if used outside of FeaturamaProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { client, isInitialized } = useFeaturama();
 *
 *   const handleCreateRequest = async () => {
 *     await client.createRequest({
 *       title: 'New Feature',
 *       description: 'A great new feature',
 *       submitterIdentifier: 'user-123',
 *     });
 *   };
 *
 *   return <Button onPress={handleCreateRequest}>Submit</Button>;
 * }
 * ```
 */
export function useFeaturama(): FeaturamaContextValue {
  const context = useContext(FeaturamaContext);

  if (!context) {
    throw new Error(
      'useFeaturama must be used within a FeaturamaProvider. ' +
        'Make sure to wrap your component tree with <FeaturamaProvider config={...}>.'
    );
  }

  return context;
}
