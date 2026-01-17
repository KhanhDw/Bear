// libs/utils/cache.ts
import { createClient, RedisClientType } from 'redis';
import { get } from 'http';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  namespace?: string; // Namespace for keys
}

export class CacheManager {
  private client: RedisClientType;
  private defaultTtl: number;
  private namespace: string;

  constructor(redisUrl: string, options: CacheOptions = {}) {
    this.client = createClient({ url: redisUrl });
    this.defaultTtl = options.ttl || 3600; // 1 hour default
    this.namespace = options.namespace || 'bear-cache';
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
  }

  private getKey(key: string): string {
    return `${this.namespace}:${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(this.getKey(key));
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl: number = this.defaultTtl): Promise<void> {
    try {
      await this.client.setEx(this.getKey(key), ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(this.getKey(key));
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async flush(): Promise<void> {
    try {
      await this.client.flushDb();
    } catch (error) {
      console.error('Cache flush error:', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(this.getKey(key));
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }
}