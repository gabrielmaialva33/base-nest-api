import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Observable, from, concatMap, map, toArray, switchMap } from 'rxjs';

const CACHE_INDEX_KEY = '__cache_keys_index__';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  /**
   * Adds a key to the cache index.
   * This is required since `keys()` is not natively available.
   * @param key - The key to be tracked.
   */
  private async trackKey(key: string): Promise<void> {
    const keys: string[] = (await this.cacheManager.get(CACHE_INDEX_KEY)) || [];
    if (!keys.includes(key)) {
      keys.push(key);
      await this.cacheManager.set(CACHE_INDEX_KEY, keys);
    }
  }

  /**
   * Removes a key from the cache index.
   * @param key - The key to be removed.
   */
  private async untrackKey(key: string): Promise<void> {
    const keys: string[] = (await this.cacheManager.get(CACHE_INDEX_KEY)) || [];
    const updatedKeys = keys.filter((k) => k !== key);
    await this.cacheManager.set(CACHE_INDEX_KEY, updatedKeys);
  }

  /**
   * Retrieves all stored cache keys.
   * @returns A promise resolving to an array of keys.
   */
  private async getAllKeys(): Promise<string[]> {
    return (await this.cacheManager.get(CACHE_INDEX_KEY)) || [];
  }

  /**
   * Deletes all cache keys that match a given regex pattern.
   * @param regexString - The regex pattern to match keys.
   * @returns An Observable that emits `true` when keys are deleted.
   */
  deleteMatch(regexString: string): Observable<boolean> {
    return from(this.getAllKeys()).pipe(
      concatMap((keys: string[]) => {
        const regex = new RegExp(regexString, 'i');
        const matchingKeys = keys.filter((key) => regex.test(key));
        return from(matchingKeys);
      }),
      concatMap((key: string) =>
        from(this.cacheManager.del(key)).pipe(map(() => key)),
      ),
      toArray(),
      switchMap((deletedKeys) =>
        from(
          Promise.all(deletedKeys.map((key) => this.untrackKey(key))).then(
            () => true,
          ),
        ),
      ),
    );
  }

  /**
   * Stores a key-value pair in the cache and tracks the key.
   * @param key - The cache key.
   * @param value - The cache value.
   * @param ttl - Optional time-to-live in milliseconds.
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
    await this.trackKey(key);
  }

  /**
   * Retrieves a value from the cache.
   * @param key - The cache key.
   * @returns The cached value or null if not found.
   */
  async get<T>(key: string): Promise<T | null> {
    return await this.cacheManager.get<T>(key);
  }

  /**
   * Deletes a specific key from the cache and updates the index.
   * @param key - The key to delete.
   */
  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
    await this.untrackKey(key);
  }

  /**
   * Clears the entire cache and resets the key index.
   */
  async resetCache(): Promise<void> {
    await this.cacheManager.clear();
    await this.cacheManager.set(CACHE_INDEX_KEY, []);
  }
}
