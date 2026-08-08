import { useEffect, useRef } from 'react';

interface UseInfiniteScrollSentinelParams {
  onIntersect: () => void;
  enabled?: boolean;
  rootMargin?: string;
}

export function useInfiniteScrollSentinel({
  onIntersect,
  enabled = true,
  rootMargin = '200px',
}: UseInfiniteScrollSentinelParams) {
  const sentinelRef = useRef<HTMLTableRowElement | null>(null);

  // Keep the latest callback without re-creating the observer on every render.
  const onIntersectRef = useRef(onIntersect);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onIntersectRef.current();
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return sentinelRef;
}
