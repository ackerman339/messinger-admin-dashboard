import { useCallback, useEffect, useRef, useState } from 'react';
import type { Pagination } from '@/types';

interface UseCursorPaginationParams<TResponse> {
  fetchPage: (cursor: string | null) => Promise<Pagination<TResponse>>;
  // Resets and reloads the first page when these change (e.g. filters, userId).
  deps?: unknown[];
}

export function useCursorPagination<TItem>({
  fetchPage,
  deps = [],
}: UseCursorPaginationParams<TItem>) {
  const [items, setItems] = useState<TItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Keep the latest fetchPage without re-triggering the effect below on every render.
  const fetchPageRef = useRef(fetchPage);

  const loadPage = useCallback(async (cursor: string | null, isFirstPage: boolean) => {
    if (isFirstPage) setIsInitialLoading(true);
    else setIsLoadingMore(true);
    setError(null);

    try {
      const response = await fetchPageRef.current(cursor);
      setItems((prev) => (isFirstPage ? response.page : [...prev, ...response.page]));
      setNextCursor(response.nextCursor ?? null);
      setHasMore(response.nextCursor !== null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al cargar datos'));
    } finally {
      setIsInitialLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMore(true);
    loadPage(null, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const loadMore = useCallback(() => {
    if (isInitialLoading || isLoadingMore || !hasMore) return;
    loadPage(nextCursor, false);
  }, [isInitialLoading, isLoadingMore, hasMore, nextCursor, loadPage]);

  const refresh = useCallback(() => {
    setHasMore(true);
    loadPage(null, true);
  }, [loadPage]);

  return {
    items,
    setItems, // exposed for optimistic updates (e.g. remove a row without a full refetch)
    isInitialLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refresh,
  };
}
