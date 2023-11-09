// cache.ts
export class Cache<T> {
  private cache: {
    [key: string]: { timestamp: number; promise: Promise<T> };
  };

  constructor() {
    this.cache = {};
  }

  async promiseCache(
    key: string,
    fn: () => Promise<T>,
    ttl: number = 1
  ): Promise<T> {
    const nowInSeconds = Math.floor(Date.now() / 1000); // Convert current time to seconds
    const cacheEntry = this.cache[key];

    if (cacheEntry) {
      const { timestamp, promise } = cacheEntry;
      // If the cache is not expired, return the stored promise.
      if (nowInSeconds - timestamp < ttl) {
        return promise as Promise<T>;
      }
      // If the cache is expired, delete it so we can refresh it.
      delete this.cache[key];
    }

    // Store the promise in the cache before it resolves, so subsequent calls can use the same promise.
    const promise: Promise<T> = fn();
    this.cache[key] = { timestamp: nowInSeconds, promise }; // Store current time in seconds

    try {
      // Await for the promise to resolve and return the result.
      const result: T = await promise;
      return result;
    } catch (error) {
      // If there's an error, remove the cache entry and throw the error.
      delete this.cache[key];
      throw error;
    }
  }

  // Simple function to get the cached value for a key if it exists and is not expired.
  async getCacheValue(key: string, ttl: number = 1): Promise<T | null> {
    const nowInSeconds = Math.floor(Date.now() / 1000); // Convert current time to seconds
    const cacheEntry = this.cache[key];

    if (cacheEntry) {
      const { timestamp, promise } = cacheEntry;
      // Check if the cache entry is still within the TTL.
      if (nowInSeconds - timestamp < ttl) {
        return promise as unknown as Promise<T>; // Cast because we cannot directly infer that the promise has resolved.
      }
    }
    return Promise.resolve(null); // Return null if there is no valid cache entry.
  }
}
