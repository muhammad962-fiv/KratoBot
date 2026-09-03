/**
 * Simple in-memory TTL cache for read-heavy API endpoints.
 */

interface CacheEntry {
  data: any;
  expires: number;
}

export function createCache(defaultTTL = 300_000) {
  const store = new Map<string, CacheEntry>();

  return {
    get(key: string): any | null {
      const entry = store.get(key);
      if (!entry) return null;
      if (Date.now() > entry.expires) {
        store.delete(key);
        return null;
      }
      return entry.data;
    },

    set(key: string, data: any, ttl = defaultTTL): void {
      store.set(key, { data, expires: Date.now() + ttl });
    },

    invalidatePrefix(prefix: string): void {
      for (const key of store.keys()) {
        if (key.startsWith(prefix)) {
          store.delete(key);
        }
      }
    },

    clear(): void {
      store.clear();
    },
  };
}

// Shared cache instances
export const projectCache = createCache(300_000); // 5 min
export const reportCache = createCache(300_000);  // 5 min
