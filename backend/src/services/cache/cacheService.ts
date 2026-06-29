import Redis from 'ioredis'
import logger from '../../config/logger'

const REDIS_URL = process.env.REDIS_URL || ''

let client: Redis | null = null
let enabled = false

export function initCache() {
  if (!REDIS_URL) {
    logger.warn('[Cache] Redis not configured — caching disabled')
    return
  }

  try {
    client = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 3) return null
        return Math.min(times * 200, 2000)
      },
      lazyConnect: true,
    })

    client.on('error', (err) => {
      logger.error('[Cache] Redis error:', err.message)
    })

    client.on('connect', () => {
      logger.info('[Cache] Redis connected')
      enabled = true
    })

    client.connect().catch(() => {
      logger.warn('[Cache] Redis connection failed — caching disabled')
    })
  } catch {
    logger.warn('[Cache] Redis init failed — caching disabled')
  }
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!enabled || !client) return null
  try {
    const data = await client.get(key)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 86400): Promise<void> {
  if (!enabled || !client) return
  try {
    await client.set(key, JSON.stringify(value), 'EX', ttlSeconds)
  } catch { /* silent */ }
}

export async function cacheDel(pattern: string): Promise<void> {
  if (!enabled || !client) return
  try {
    const keys = await client.keys(pattern)
    if (keys.length > 0) await client.del(...keys)
  } catch { /* silent */ }
}

export function cacheKey(prefix: string, ...parts: string[]): string {
  return `vp:${prefix}:${parts.join(':')}`
}
