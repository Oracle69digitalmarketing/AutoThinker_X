/**
 * cache.ts
 * Phase 10 — Performance
 */

interface CacheEntry {
  content: any;
  timestamp: number;
}

const CACHE_TTL = 1000 * 60 * 60; // 1 hour
const memoryCache = new Map<string, CacheEntry>();

export function getCachedCompletion(key: string): any | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    memoryCache.delete(key);
    return null;
  }
  
  return entry.content;
}

export function setCachedCompletion(key: string, content: any): void {
  // Simple cache eviction if too large
  if (memoryCache.size > 100) {
    const firstKey = memoryCache.keys().next().value;
    if (firstKey !== undefined) memoryCache.delete(firstKey);
  }
  
  memoryCache.set(key, {
    content,
    timestamp: Date.now()
  });
}

export function generateCacheKey(agent: string, input: string): string {
  // Simple hash-like key
  return `${agent}:${input.substring(0, 50)}`.toLowerCase().replace(/\s+/g, '_');
}
