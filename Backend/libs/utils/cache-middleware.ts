// libs/utils/cache-middleware.ts
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { CacheManager } from "./cache.js";

export interface CacheMiddlewareOptions {
  cache: CacheManager;
  ttl?: number;
  keyGenerator?: (req: FastifyRequest) => string;
}

export const cacheMiddleware = (options: CacheMiddlewareOptions) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    // Generate cache key
    const cacheKey = options.keyGenerator 
      ? options.keyGenerator(req) 
      : `${req.method}:${req.url}:${JSON.stringify(req.query)}`;
    
    // Try to get from cache
    const cachedResult = await options.cache.get(cacheKey);
    if (cachedResult) {
      reply.send(cachedResult);
      return; // Skip the handler if we have a cached response
    }
    
    // Store original reply.send to intercept the response
    const originalSend = reply.send.bind(reply);
    
    // Override reply.send to cache the response
    reply.send = async (payload: any) => {
      // Cache the response
      await options.cache.set(cacheKey, payload, options.ttl);
      return originalSend(payload);
    };
  };
};

// Decorator to add cache functionality to Fastify instance
export const addCacheDecorator = (fastify: FastifyInstance, cache: CacheManager) => {
  fastify.decorate('cache', cache);
  
  // Add a helper method to cache responses
  fastify.decorate('withCache', (ttl: number = 3600) => {
    return async (req: FastifyRequest, reply: FastifyReply) => {
      const cacheKey = `${req.method}:${req.url}:${JSON.stringify(req.query)}:${JSON.stringify(req.params)}`;
      
      // Try to get from cache
      const cachedResult = await cache.get(cacheKey);
      if (cachedResult) {
        reply.send(cachedResult);
        return;
      }
      
      // Store original send method
      const originalSend = reply.send.bind(reply);
      
      // Override send to cache the response
      reply.send = async (payload: any) => {
        if (reply.statusCode < 400) { // Only cache successful responses
          await cache.set(cacheKey, payload, ttl);
        }
        return originalSend(payload);
      };
    };
  });
};