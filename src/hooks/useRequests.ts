import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useFeaturama } from './useFeaturama';
import type {
  FeatureRequest,
  PaginatedResponse,
  UseRequestsOptions,
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
export function useRequests(options: UseRequestsOptions = {}): UseRequestsResult {
  const { client } = useFeaturama();
  const { pageSize = 20, filter, submitterIdentifier, enabled = true } = options;
  const query = useMemo(
    () => ({ client, pageSize, filter, submitterIdentifier, enabled }),
    [client, pageSize, filter, submitterIdentifier, enabled]
  );

  const [data, setData] = useState<PaginatedResponse<FeatureRequest> | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const activeQueryRef = useRef<typeof query | null>(null);
  const latestRequestRef = useRef(0);

  const fetchData = useCallback(
    async (page: number, append: boolean = false) => {
      // Also reject callbacks retained by an earlier filter, identity or client.
      if (!query.enabled || activeQueryRef.current !== query) return;
      const requestId = ++latestRequestRef.current;
      const isCurrent = () =>
        activeQueryRef.current === query && latestRequestRef.current === requestId;
      setIsLoading(true);
      setError(null);

      try {
        const response = await query.client.getRequests({
          page,
          pageSize: query.pageSize,
          filter: query.filter,
          submitterIdentifier: query.submitterIdentifier,
        });

        if (!isCurrent()) return;

        setData((previous) => append && previous
          ? { ...response, items: [...previous.items, ...response.items] }
          : response);

        setCurrentPage(page);
      } catch (err) {
        if (!isCurrent()) return;
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        if (isCurrent()) {
          setIsLoading(false);
        }
      }
    },
    [query]
  );

  // A new query owns a fresh list; its predecessors must never publish again.
  useEffect(() => {
    activeQueryRef.current = query;
    setData(null);
    setCurrentPage(1);
    setError(null);
    if (query.enabled) {
      void fetchData(1);
    } else {
      setIsLoading(false);
    }

    return () => {
      activeQueryRef.current = null;
      ++latestRequestRef.current;
    };
  }, [query, fetchData]);

  const refetch = useCallback(async () => {
    await fetchData(1, false);
  }, [fetchData]);

  const hasNextPage = enabled && data
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
