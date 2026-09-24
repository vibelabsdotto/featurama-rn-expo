import { useState, useEffect, useCallback, useRef } from 'react';
import { useFeaturama } from './useFeaturama';
import type {
  FeatureRequest,
  PaginatedResponse,
  GetRequestsOptions,
  UseRequestsResult,
} from '../types';

/**
 * Hook for fetching and managing feature requests with pagination support.
 * Automatically fetches data on mount and provides methods for pagination and refetching.
 *
 * @param options - Optional configuration for pagination
 * @returns Object containing data, loading state, error, and control functions
 *
 * @example
 * ```tsx
 * function FeatureList() {
 *   const { data, isLoading, error, refetch, hasNextPage, fetchNextPage } = useRequests({
 *     pageSize: 10,
 *   });
 *
 *   if (isLoading) return <Text>Loading...</Text>;
 *   if (error) return <Text>Error: {error.message}</Text>;
 *
 *   return (
 *     <FlatList
 *       data={data?.items}
 *       renderItem={({ item }) => <FeatureItem request={item} />}
 *       onEndReached={() => hasNextPage && fetchNextPage()}
 *     />
 *   );
 * }
 * ```
 */
export function useRequests(options: GetRequestsOptions = {}): UseRequestsResult {
  const { client } = useFeaturama();
  const { pageSize = 20, filter, submitterIdentifier } = options;

  const [data, setData] = useState<PaginatedResponse<FeatureRequest> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  const fetchData = useCallback(
    async (page: number, append: boolean = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await client.getRequests({ page, pageSize, filter, submitterIdentifier });

        if (!isMountedRef.current) return;

        if (append && data) {
          // Append new items to existing data for infinite scroll
          setData({
            ...response,
            items: [...data.items, ...response.items],
          });
        } else {
          setData(response);
        }

        setCurrentPage(page);
      } catch (err) {
        if (!isMountedRef.current) return;
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    },
    [client, pageSize, filter, submitterIdentifier, data]
  );

  // Initial fetch
  useEffect(() => {
    isMountedRef.current = true;
    fetchData(1);

    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, pageSize, filter, submitterIdentifier]);

  const refetch = useCallback(async () => {
    setCurrentPage(1);
    await fetchData(1, false);
  }, [fetchData]);

  const hasNextPage = data
    ? currentPage * pageSize < data.totalCount
    : false;

  const fetchNextPage = useCallback(async () => {
    if (!hasNextPage || isLoading) return;
    await fetchData(currentPage + 1, true);
  }, [hasNextPage, isLoading, currentPage, fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch,
    hasNextPage,
    fetchNextPage,
  };
}
