// DISABLED: Redis imports removed for testing
// import { env } from "@/env";
// import { Redis } from "@upstash/redis";

// DISABLED: Redis client disabled for testing
export const redisClient = {
  get: async () => null,
  set: async () => null,
  del: async () => null,
  keys: async () => [],
} as any;

interface CacheConfig {
  ttl?: number;
  forceFresh?: boolean;
}

export class CacheError extends Error {
  constructor(
    message: string,
    public cause?: unknown,
  ) {
    super(message);
    this.name = "CacheError";
  }
}

export async function cache<T>(
  key: string,
  getData: () => Promise<T>,
  config: CacheConfig = {},
): Promise<T> {
  // DISABLED: Cache bypassed for testing - always return fresh data
  try {
    const fresh = await getData();
    if (fresh === undefined || fresh === null) {
      throw new Error("getData returned null/undefined");
    }
    return fresh;
  } catch (error) {
    throw new CacheError(`Cache operation failed for key: ${key}`, error);
  }
}

export async function invalidateCache(key: string): Promise<void> {
  // DISABLED: Cache invalidation bypassed for testing
  console.log(`Cache invalidation skipped for key: ${key}`);
}

export async function invalidatePattern(pattern: string): Promise<void> {
  // DISABLED: Cache pattern invalidation bypassed for testing
  console.log(`Cache pattern invalidation skipped for pattern: ${pattern}`);
}
