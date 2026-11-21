import { useEffect, useRef } from 'react';

interface UseInfiniteScrollSentinelParams {
  onIntersect: () => void;
  enabled?: boolean;
  rootRef?: React.RefObject<Element | null>;
  rootMargin?: string;
}

export function useInfiniteScrollSentinel<TElement extends Element = HTMLDivElement>({
  onIntersect,
  enabled = true,
  rootRef,
  rootMargin = '20px',
}: UseInfiniteScrollSentinelParams) {
  const sentinelRef = useRef<TElement | null>(null);

  const onIntersectRef = useRef(onIntersect);

  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const root = rootRef?.current ?? null;

    if (!sentinel || !enabled) {
      return;
    }

    let locked = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }

        if (!entry.isIntersecting) {
          // Allow another load once the sentinel
          // leaves the intersection area.
          locked = false;
          return;
        }

        // Prevent multiple loads while the sentinel
        // remains visible.
        if (locked) {
          return;
        }

        locked = true;

        onIntersectRef.current();
      },
      {
        root,
        rootMargin,
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [enabled, rootRef, rootMargin]);

  return sentinelRef;
}
