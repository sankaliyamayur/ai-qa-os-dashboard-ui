import { useState, useEffect, useRef, useCallback } from 'react';

// ─── In-memory cache ─────────────────────────────────────────────────────────

interface CacheEntry<T> {
  data: T;
  fetchedAt: number;
}

/**
 * PERF-3: Module-level cache shared across all hook instances.
 * Keyed by the cache key string; TTL is configurable per call site.
 */
const cache = new Map<string, CacheEntry<unknown>>();

// ─── Hook interface ───────────────────────────────────────────────────────────

export interface UseQueryResult<T> {
  data: T | undefined;
  loading: boolean;
  error: string | null;
  /** Manually trigger a fresh fetch, bypassing the cache. */
  refetch: () => void;
}

export interface UseQueryOptions {
  /** Cache TTL in milliseconds (default: 30 000ms = 30s). Set to 0 to disable caching. */
  ttl?: number;
  /** Set to false to skip the fetch entirely (e.g., while a required param is undefined). */
  enabled?: boolean;
}

/**
 * PERF-3: Lightweight data-fetching hook with in-memory cache.
 *
 * Design decisions:
 *  - No external dependencies (react-query removed in MNT-4, adopted from scratch here).
 *  - Module-level `cache` Map survives re-renders and page navigations within the same session.
 *  - Fresh fetch is triggered by: initial mount, `key` change, `refetch()` call, cache expiry.
 *  - Stale-while-revalidate: returns cached data immediately, re-fetches in background when stale.
 *
 * @param key      - Unique cache key (e.g. `"executions"`, `"execution:exec-123"`)
 * @param fetcher  - Async function that performs the actual API call
 * @param options  - TTL and enabled flag
 */
export function useQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseQueryOptions = {}
): UseQueryResult<T> {
  const { ttl = 3_000, enabled = true } = options;

  const [data, setData]       = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError]     = useState<string | null>(null);
  const cancelledRef          = useRef(false);
  const forceRef              = useRef(false); // true = bypass cache on next run

  const execute = useCallback(async () => {
    if (!enabled) return;

    // Check cache (unless forced refetch)
    if (!forceRef.current && ttl > 0) {
      const cached = cache.get(key) as CacheEntry<T> | undefined;
      if (cached && Date.now() - cached.fetchedAt < ttl) {
        setData(cached.data);
        setLoading(false);
        setError(null);
        return;
      }
    }
    forceRef.current = false;

    cancelledRef.current = false;
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      if (!cancelledRef.current) {
        setData(result);
        if (ttl > 0) {
          cache.set(key, { data: result, fetchedAt: Date.now() });
        }
      }
    } catch (err: any) {
      if (!cancelledRef.current) {
        const message = err?.response?.data?.message
          ?? err?.message
          ?? 'An unexpected error occurred';
        setError(message);
      }
    } finally {
      if (!cancelledRef.current) {
        setLoading(false);
      }
    }
  }, [key, fetcher, enabled, ttl]);

  useEffect(() => {
    cancelledRef.current = false;
    execute();
    return () => {
      cancelledRef.current = true;
    };
  }, [execute]);

  const refetch = useCallback(() => {
    forceRef.current = true;
    execute();
  }, [execute]);

  return { data, loading, error, refetch };
}

/** Evict a specific cache entry. Useful after a mutation. */
export function invalidateCache(key: string): void {
  cache.delete(key);
}

/** Evict all cache entries matching a prefix (e.g. all "execution:" entries). */
export function invalidateCacheByPrefix(prefix: string): void {
  for (const k of cache.keys()) {
    if (k.startsWith(prefix)) cache.delete(k);
  }
}
