import { useEffect, useRef } from 'react';

interface UseInfiniteScrollSentinelParams {
  onIntersect: () => void;
  enabled?: boolean;
  rootMargin?: string;
}

export function useInfiniteScrollSentinel<TElement extends Element = HTMLTableRowElement>({
  onIntersect,
  enabled = true,
  rootMargin = '200px',
}: UseInfiniteScrollSentinelParams) {
  const sentinelRef = useRef<TElement | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onIntersect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, rootMargin, onIntersect]);

  return sentinelRef;
}
