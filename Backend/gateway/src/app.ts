// gateway/src/app.ts
import Fastify from "fastify";
import proxy from "@fastify/http-proxy";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import circuitBreaker from 'opossum';
import { health, readiness } from "./health/health.route.js";
import { logger } from '../../libs/logger/src/structured.logger.js';
import { traceMiddleware } from '../../libs/middleware/src/trace.middleware.js';
import { ServiceReliability } from '../../libs/reliability/src/circuit.breaker.js';
import { env } from './config/env.js';

export const buildApp = () => {
  const app = Fastify({
    logger: {
      transport: {
        target: "pino-pretty",
      },
    },
  });

  // Security headers
  app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"]
      }
    }
  });

  // CORS configuration
  app.register(cors, {
    origin: process.env.CORS_ORIGIN || "*", // In production, specify exact origins
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "x-trace-id", "x-user-id"],
  });

  // Rate limiting with Redis
  app.register(rateLimit, {
    max: 1000,
    timeWindow: "1 minute",
    keyGenerator: (req) => {
      return req.headers['x-forwarded-for'] as string || 
             req.ip || 
             (req.headers['x-real-ip'] as string) ||
             req.socket.remoteAddress || 'unknown';
    },
    redis: process.env.REDIS_URL ? require('redis').createClient({
      url: process.env.REDIS_URL
    }) : undefined,
    skipOnError: true, // do not block the request when redis is down
  });

  // JWT authentication
  app.register(jwt, {
    secret: process.env.JWT_SECRET || "supersecretkey",
  });

  // Health check endpoints
  app.get("/health", health);
  app.get("/ready", readiness);

  // Add trace middleware
  app.addHook('onRequest', async (req, reply, done) => {
    // Generate or propagate trace ID
    const traceId = req.headers['x-trace-id'] as string || crypto.randomUUID();
    const userId = req.headers['x-user-id'] as string;
    
    req.headers['x-trace-id'] = traceId;
    
    // Add to logger context
    const requestLogger = logger.child({ traceId, userId });
    
    // Attach to request for use in handlers
    (req as any).requestLogger = requestLogger;
    
    // Add to response headers
    reply.header('x-trace-id', traceId);
    
    done();
  });

  // Authentication middleware
  app.addHook("preHandler", async (request, reply) => {
    // Skip authentication for health checks, auth endpoints, and public routes
    const publicPaths = [
      "/health",
      "/ready",
      "/auth/login",
      "/auth/register",
      "/auth/refresh",
      "/auth/verify"
    ];

    const isPublicRoute = publicPaths.some(path => request.url.includes(path));

    if (isPublicRoute) {
      return;
    }

    // Add authentication to protected routes
    const protectedPaths = [
      "/users",
      "/posts",
      "/comments",
      "/search",
      "/feed",
      "/votes",
      "/notifications",
      "/messages",
      "/media",
      "/groups",
      "/analytics",
      "/moderation"
    ];

    const isProtectedRoute = protectedPaths.some(path => request.url.startsWith(path));

    if (isProtectedRoute) {
      try {
        await request.jwtVerify();
        
        // Propagate user ID and trace ID
        const decoded = request.user as any;
        request.headers['x-user-id'] = decoded.userId;
        request.headers['x-trace-id'] = request.headers['x-trace-id'] || crypto.randomUUID();
      } catch (err) {
        return reply.status(401).send({ error: "Unauthorized" });
      }
    }
  });

  // Proxy routes to auth service
  app.register(proxy, {
    upstream: "http://auth-service:3001", // Auth service
    prefix: "/auth",
    rewritePrefix: "",
    http2: false,
    undici: {
      connect: {
        timeout: 5000
      }
    },
    replyOptions: {
      rewriteHeaders: (headers, req) => {
        // Add correlation headers
        headers['x-trace-id'] = req.headers['x-trace-id'] || crypto.randomUUID();
        headers['x-user-id'] = req.headers['x-user-id'];
        headers['x-request-id'] = crypto.randomUUID();
        return headers;
      }
    }
  });

  // Proxy routes to user service
  app.register(proxy, {
    upstream: "http://user-service:3002", // User service
    prefix: "/users",
    rewritePrefix: "",
    http2: false,
    undici: {
      connect: {
        timeout: 5000
      }
    },
    replyOptions: {
      rewriteHeaders: (headers, req) => {
        // Add correlation headers
        headers['x-trace-id'] = req.headers['x-trace-id'] || crypto.randomUUID();
        headers['x-user-id'] = req.headers['x-user-id'];
        headers['x-request-id'] = crypto.randomUUID();
        return headers;
      }
    }
  });

  // Proxy routes to post service
  app.register(proxy, {
    upstream: "http://post-service:3003", // Post service
    prefix: "/posts",
    rewritePrefix: "",
    http2: false,
    undici: {
      connect: {
        timeout: 5000
      }
    },
    replyOptions: {
      rewriteHeaders: (headers, req) => {
        // Add correlation headers
        headers['x-trace-id'] = req.headers['x-trace-id'] || crypto.randomUUID();
        headers['x-user-id'] = req.headers['x-user-id'];
        headers['x-request-id'] = crypto.randomUUID();
        return headers;
      }
    }
  });

  // Proxy routes to comment service
  app.register(proxy, {
    upstream: "http://comment-service:3004", // Comment service
    prefix: "/comments",
    rewritePrefix: "",
    http2: false,
    undici: {
      connect: {
        timeout: 5000
      }
    },
    replyOptions: {
      rewriteHeaders: (headers, req) => {
        // Add correlation headers
        headers['x-trace-id'] = req.headers['x-trace-id'] || crypto.randomUUID();
        headers['x-user-id'] = req.headers['x-user-id'];
        headers['x-request-id'] = crypto.randomUUID();
        return headers;
      }
    }
  });

  // Proxy routes to vote service
  app.register(proxy, {
    upstream: "http://vote-service:3005", // Vote service
    prefix: "/votes",
    rewritePrefix: "",
    http2: false,
    undici: {
      connect: {
        timeout: 5000
      }
    },
    replyOptions: {
      rewriteHeaders: (headers, req) => {
        // Add correlation headers
        headers['x-trace-id'] = req.headers['x-trace-id'] || crypto.randomUUID();
        headers['x-user-id'] = req.headers['x-user-id'];
        headers['x-request-id'] = crypto.randomUUID();
        return headers;
      }
    }
  });

  // Proxy routes to feed service
  app.register(proxy, {
    upstream: "http://feed-service:3006", // Feed service
    prefix: "/feed",
    rewritePrefix: "",
    http2: false,
    undici: {
      connect: {
        timeout: 5000
      }
    },
    replyOptions: {
      rewriteHeaders: (headers, req) => {
        // Add correlation headers
        headers['x-trace-id'] = req.headers['x-trace-id'] || crypto.randomUUID();
        headers['x-user-id'] = req.headers['x-user-id'];
        headers['x-request-id'] = crypto.randomUUID();
        return headers;
      }
    }
  });

  // Proxy routes to notification service
  app.register(proxy, {
    upstream: "http://notification-service:3007", // Notification service
    prefix: "/notifications",
    rewritePrefix: "",
    http2: false,
    undici: {
      connect: {
        timeout: 5000
      }
    },
    replyOptions: {
      rewriteHeaders: (headers, req) => {
        // Add correlation headers
        headers['x-trace-id'] = req.headers['x-trace-id'] || crypto.randomUUID();
        headers['x-user-id'] = req.headers['x-user-id'];
        headers['x-request-id'] = crypto.randomUUID();
        return headers;
      }
    }
  });

  // Proxy routes to messaging service
  app.register(proxy, {
    upstream: "http://messaging-service:3008", // Messaging service
    prefix: "/messages",
    rewritePrefix: "",
    http2: false,
    undici: {
      connect: {
        timeout: 5000
      }
    },
    replyOptions: {
      rewriteHeaders: (headers, req) => {
        // Add correlation headers
        headers['x-trace-id'] = req.headers['x-trace-id'] || crypto.randomUUID();
        headers['x-user-id'] = req.headers['x-user-id'];
        headers['x-request-id'] = crypto.randomUUID();
        return headers;
      }
    }
  });

  // Proxy routes to media service
  app.register(proxy, {
    upstream: "http://media-service:3009", // Media service
    prefix: "/media",
    rewritePrefix: "",
    http2: false,
    undici: {
      connect: {
        timeout: 5000
      }
    },
    replyOptions: {
      rewriteHeaders: (headers, req) => {
        // Add correlation headers
        headers['x-trace-id'] = req.headers['x-trace-id'] || crypto.randomUUID();
        headers['x-user-id'] = req.headers['x-user-id'];
        headers['x-request-id'] = crypto.randomUUID();
        return headers;
      }
    }
  });

  // Proxy routes to group service
  app.register(proxy, {
    upstream: "http://group-service:3010", // Group service
    prefix: "/groups",
    rewritePrefix: "",
    http2: false,
    undici: {
      connect: {
        timeout: 5000
      }
    },
    replyOptions: {
      rewriteHeaders: (headers, req) => {
        // Add correlation headers
        headers['x-trace-id'] = req.headers['x-trace-id'] || crypto.randomUUID();
        headers['x-user-id'] = req.headers['x-user-id'];
        headers['x-request-id'] = crypto.randomUUID();
        return headers;
      }
    }
  });

  // Proxy routes to search service
  app.register(proxy, {
    upstream: "http://search-service:3011", // Search service
    prefix: "/search",
    rewritePrefix: "",
    http2: false,
    undici: {
      connect: {
        timeout: 5000
      }
    },
    replyOptions: {
      rewriteHeaders: (headers, req) => {
        // Add correlation headers
        headers['x-trace-id'] = req.headers['x-trace-id'] || crypto.randomUUID();
        headers['x-user-id'] = req.headers['x-user-id'];
        headers['x-request-id'] = crypto.randomUUID();
        return headers;
      }
    }
  });

  // Proxy routes to analytics service
  app.register(proxy, {
    upstream: "http://analytics-service:3012", // Analytics service
    prefix: "/analytics",
    rewritePrefix: "",
    http2: false,
    undici: {
      connect: {
        timeout: 5000
      }
    },
    replyOptions: {
      rewriteHeaders: (headers, req) => {
        // Add correlation headers
        headers['x-trace-id'] = req.headers['x-trace-id'] || crypto.randomUUID();
        headers['x-user-id'] = req.headers['x-user-id'];
        headers['x-request-id'] = crypto.randomUUID();
        return headers;
      }
    }
  });

  // Proxy routes to moderation service
  app.register(proxy, {
    upstream: "http://moderation-service:3013", // Moderation service
    prefix: "/moderation",
    rewritePrefix: "",
    http2: false,
    undici: {
      connect: {
        timeout: 5000
      }
    },
    replyOptions: {
      rewriteHeaders: (headers, req) => {
        // Add correlation headers
        headers['x-trace-id'] = req.headers['x-trace-id'] || crypto.randomUUID();
        headers['x-user-id'] = req.headers['x-user-id'];
        headers['x-request-id'] = crypto.randomUUID();
        return headers;
      }
    }
  });

  // Add a fallback route for debugging
  app.get("/", async () => ({
    message: "API Gateway is running",
    services: {
      auth: "http://localhost:3001/auth",
      user: "http://localhost:3002/users",
      post: "http://localhost:3003/posts",
      comment: "http://localhost:3004/comments",
      vote: "http://localhost:3005/votes",
      feed: "http://localhost:3006/feed",
      notification: "http://localhost:3007/notifications",
      message: "http://localhost:3008/messages",
      media: "http://localhost:3009/media",
      group: "http://localhost:3010/groups",
      search: "http://localhost:3011/search",
      analytics: "http://localhost:3012/analytics",
      moderation: "http://localhost:3013/moderation",
    },
  }));

  return app;
};