import { Redis } from 'ioredis';
import { logger } from '../../logger/src/structured.logger.js';

export interface CacheOptions {
  ttl?: number; // seconds
  prefix?: string;
}

export class RedisManager {
  private client: Redis;

  constructor(options: {
    host: string;
    port: number;
    password?: string;
    db?: number;
  }) {
    this.client = new Redis({
      host: options.host,
      port: options.port,
      password: options.password,
      db: options.db,
      lazyConnect: true,
      maxRetriesPerRequest: 3,
      enableReadyCheck: true
    });

    this.client.on('error', (err) => {
      logger.error('Redis error', err);
    });

    this.client.on('connect', () => {
      logger.info('Connected to Redis');
    });
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.quit();
  }

  async get(key: string, options: CacheOptions = {}): Promise<any> {
    const prefixedKey = options.prefix ? `${options.prefix}:${key}` : key;
    try {
      const value = await this.client.get(prefixedKey);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error(`Error getting cache key ${prefixedKey}`, error);
      return null;
    }
  }

  async set(key: string, value: any, options: CacheOptions = {}): Promise<boolean> {
    const prefixedKey = options.prefix ? `${options.prefix}:${key}` : key;
    const ttl = options.ttl || 3600; // 1 hour default

    try {
      await this.client.setex(prefixedKey, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error(`Error setting cache key ${prefixedKey}`, error);
      return false;
    }
  }

  async del(key: string, options: CacheOptions = {}): Promise<boolean> {
    const prefixedKey = options.prefix ? `${options.prefix}:${key}` : key;
    try {
      await this.client.del(prefixedKey);
      return true;
    } catch (error) {
      logger.error(`Error deleting cache key ${prefixedKey}`, error);
      return false;
    }
  }

  async invalidatePattern(pattern: string): Promise<number> {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
      return keys.length;
    } catch (error) {
      logger.error(`Error invalidating cache pattern ${pattern}`, error);
      return 0;
    }
  }

  // Session management
  async storeSession(sessionId: string, userData: any, ttl: number = 3600): Promise<boolean> {
    return this.set(sessionId, userData, { prefix: 'session', ttl });
  }

  async getSession(sessionId: string): Promise<any> {
    return this.get(sessionId, { prefix: 'session' });
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    return this.del(sessionId, { prefix: 'session' });
  }
}
