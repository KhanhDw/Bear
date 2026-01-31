// gateway/src/app.ts
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import proxy from "@fastify/http-proxy";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import crypto from 'crypto';
import Fastify from "fastify";
import { logger } from '../../libs/logger/src/structured.logger.js';
import { env } from './config/env.js';
import { health, readiness } from "./health/health.route.js";

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
    redis: process.env.REDIS_URL ? (() => {
      try {
        return require('redis').createClient({
          url: process.env.REDIS_URL
        });
      } catch (error) {
        console.error('Failed to create Redis client:', error);
        return undefined;
      }
    })() : undefined,
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
  app.addHook('onRequest', async (req, reply) => {
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
      "/feed",
      "/notifications",
      "/messages",
      "/media"
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
    upstream: `http://${env.LOCAL_AUTH_SERVICE_HOST}:${env.AUTH_SERVICE_PORT}`, // Auth service
    prefix: "/auth",
    rewritePrefix: "",
    http2: false,
    undici: {
      connect: {
        timeout: 10000 // Increase timeout to 10 seconds
      }
    },
    replyOptions: {
      rewriteHeaders: (headers, req) => {
        // Add correlation headers
        const traceId = req?.headers['x-trace-id'] || crypto.randomUUID();
        const userId = req?.headers['x-user-id'];

        headers['x-trace-id'] = traceId;
        if (userId) headers['x-user-id'] = userId;
        headers['x-request-id'] = crypto.randomUUID();
        return headers;
      }
    }
  });

  // Proxy routes to user service
  app.register(proxy, {
    upstream: `http://${env.LOCAL_USER_SERVICE_HOST}:${env.USER_SERVICE_PORT}`, // User service
    prefix: "/users",
    rewritePrefix: "",
    http2: false,
    undici: {
      connect: {
        timeout: 10000 // Increase timeout to 10 seconds
      }
    },
    replyOptions: {
      rewriteHeaders: (headers, req) => {
        // Add correlation headers
        const traceId = req?.headers['x-trace-id'] || crypto.randomUUID();
        const userId = req?.headers['x-user-id'];

        headers['x-trace-id'] = traceId;
        if (userId) headers['x-user-id'] = userId;
        headers['x-request-id'] = crypto.randomUUID();
        return headers;
      }
    }
  });

  // Proxy routes to post service
  app.register(proxy, {
    upstream: `http://${env.LOCAL_POST_SERVICE_HOST}:${env.POST_SERVICE_PORT}`, // Post service
    prefix: "/posts",
    rewritePrefix: "",
    http2: false,
    undici: {
      connect: {
        timeout: 10000 // Increase timeout to 10 seconds
      }
    },
    replyOptions: {
      rewriteHeaders: (headers, req) => {
        // Add correlation headers
        const traceId = req?.headers['x-trace-id'] || crypto.randomUUID();
        const userId = req?.headers['x-user-id'];

        headers['x-trace-id'] = traceId;
        if (userId) headers['x-user-id'] = userId;
        headers['x-request-id'] = crypto.randomUUID();
        return headers;
      }
    }
  });

  // Proxy routes to comment service
  app.register(proxy, {
    upstream: `http://${env.LOCAL_COMMENT_SERVICE_HOST}:${env.COMMENT_SERVICE_PORT}`, // Comment service
    prefix: "/comments",
    rewritePrefix: "",
    http2: false,
    undici: {
      connect: {
        timeout: 10000 // Increase timeout to 10 seconds
      }
    },
    replyOptions: {
      rewriteHeaders: (headers, req) => {
        // Add correlation headers
        const traceId = req?.headers['x-trace-id'] || crypto.randomUUID();
        const userId = req?.headers['x-user-id'];

        headers['x-trace-id'] = traceId;
        if (userId) headers['x-user-id'] = userId;
        headers['x-request-id'] = crypto.randomUUID();
        return headers;
      }
    }
  });


  // Proxy routes to feed service
  app.register(proxy, {
    upstream: `http://${env.LOCAL_FEED_SERVICE_HOST}:${env.FEED_SERVICE_PORT}`, // Feed service
    prefix: "/feed",
    rewritePrefix: "",
    http2: false,
    undici: {
      connect: {
        timeout: 10000 // Increase timeout to 10 seconds
      }
    },
    replyOptions: {
      rewriteHeaders: (headers, req) => {
        // Add correlation headers
        const traceId = req?.headers['x-trace-id'] || crypto.randomUUID();
        const userId = req?.headers['x-user-id'];

        headers['x-trace-id'] = traceId;
        if (userId) headers['x-user-id'] = userId;
        headers['x-request-id'] = crypto.randomUUID();
        return headers;
      }
    }
  });

  // Proxy routes to notification service
  app.register(proxy, {
    upstream: `http://${env.LOCAL_NOTIFICATION_SERVICE_HOST}:${env.NOTIFICATION_SERVICE_PORT}`, // Notification service
    prefix: "/notifications",
    rewritePrefix: "",
    http2: false,
    undici: {
      connect: {
        timeout: 10000 // Increase timeout to 10 seconds
      }
    },
    replyOptions: {
      rewriteHeaders: (headers, req) => {
        // Add correlation headers
        const traceId = req?.headers['x-trace-id'] || crypto.randomUUID();
        const userId = req?.headers['x-user-id'];

        headers['x-trace-id'] = traceId;
        if (userId) headers['x-user-id'] = userId;
        headers['x-request-id'] = crypto.randomUUID();
        return headers;
      }
    }
  });

  // Proxy routes to messaging service
  app.register(proxy, {
    upstream: `http://${env.LOCAL_MESSAGING_SERVICE_HOST}:${env.MESSAGING_SERVICE_PORT}`, // Messaging service
    prefix: "/messages",
    rewritePrefix: "",
    http2: false,
    undici: {
      connect: {
        timeout: 10000 // Increase timeout to 10 seconds
      }
    },
    replyOptions: {
      rewriteHeaders: (headers, req) => {
        // Add correlation headers
        const traceId = req?.headers['x-trace-id'] || crypto.randomUUID();
        const userId = req?.headers['x-user-id'];

        headers['x-trace-id'] = traceId;
        if (userId) headers['x-user-id'] = userId;
        headers['x-request-id'] = crypto.randomUUID();
        return headers;
      }
    }
  });

  // Proxy routes to media service
  app.register(proxy, {
    upstream: `http://${env.LOCAL_MEDIA_SERVICE_HOST}:${env.MEDIA_SERVICE_PORT}`, // Media service
    prefix: "/media",
    rewritePrefix: "",
    http2: false,
    undici: {
      connect: {
        timeout: 10000 // Increase timeout to 10 seconds
      }
    },
    replyOptions: {
      rewriteHeaders: (headers, req) => {
        // Add correlation headers
        const traceId = req?.headers['x-trace-id'] || crypto.randomUUID();
        const userId = req?.headers['x-user-id'];

        headers['x-trace-id'] = traceId;
        if (userId) headers['x-user-id'] = userId;
        headers['x-request-id'] = crypto.randomUUID();
        return headers;
      }
    }
  });





  // Add a fallback route for debugging
  app.get("/", async () => ({
    message: "API Gateway is running",
    services: {
      auth: `http://localhost:8080/auth (proxies to http://${env.LOCAL_AUTH_SERVICE_HOST}:${env.AUTH_SERVICE_PORT})`,
      user: `http://localhost:8080/users (proxies to http://${env.LOCAL_USER_SERVICE_HOST}:${env.USER_SERVICE_PORT})`,
      post: `http://localhost:8080/posts (proxies to http://${env.LOCAL_POST_SERVICE_HOST}:${env.POST_SERVICE_PORT})`,
      comment: `http://localhost:8080/comments (proxies to http://${env.LOCAL_COMMENT_SERVICE_HOST}:${env.COMMENT_SERVICE_PORT})`,
      feed: `http://localhost:8080/feed (proxies to http://${env.LOCAL_FEED_SERVICE_HOST}:${env.FEED_SERVICE_PORT})`,
      notification: `http://localhost:8080/notifications (proxies to http://${env.LOCAL_NOTIFICATION_SERVICE_HOST}:${env.NOTIFICATION_SERVICE_PORT})`,
      message: `http://localhost:8080/messages (proxies to http://${env.LOCAL_MESSAGING_SERVICE_HOST}:${env.MESSAGING_SERVICE_PORT})`,
      media: `http://localhost:8080/media (proxies to http://${env.LOCAL_MEDIA_SERVICE_HOST}:${env.MEDIA_SERVICE_PORT})`,
    },
  }));

  return app;
};