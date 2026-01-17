// gateway/src/app.ts
import Fastify from "fastify";
import proxy from "@fastify/http-proxy";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
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
  app.register(helmet);

  // CORS configuration
  app.register(cors, {
    origin: process.env.CORS_ORIGIN || "*", // In production, specify exact origins
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  });

  // Rate limiting with Redis
  app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
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
      "/votes"
    ];

    const isProtectedRoute = protectedPaths.some(path => request.url.startsWith(path));

    if (isProtectedRoute) {
      try {
        await request.jwtVerify();
      } catch (err) {
        return reply.status(401).send({ error: "Unauthorized" });
      }
    }
  });

  // Proxy routes to auth service
  app.register(proxy, {
    upstream: "http://localhost:3005", // Auth service
    prefix: "/auth",
    rewritePrefix: "",
    http2: false,
  });

  // Proxy routes to user service
  app.register(proxy, {
    upstream: "http://localhost:3001", // User service
    prefix: "/users",
    rewritePrefix: "",
    http2: false,
  });

  // Proxy routes to post service
  app.register(proxy, {
    upstream: "http://localhost:3003", // Post service (updated port)
    prefix: "/posts",
    rewritePrefix: "",
    http2: false,
  });

  // Proxy routes to comment service
  app.register(proxy, {
    upstream: "http://localhost:3002", // Comment service
    prefix: "/comments",
    rewritePrefix: "",
    http2: false,
  });

  // Proxy routes to search service
  app.register(proxy, {
    upstream: "http://localhost:3004", // Search service
    prefix: "/search",
    rewritePrefix: "",
    http2: false,
  });

  // Proxy routes to vote service
  app.register(proxy, {
    upstream: "http://localhost:3005", // Vote service
    prefix: "/votes",
    rewritePrefix: "",
    http2: false,
  });

  // Proxy routes to feed service
  app.register(proxy, {
    upstream: "http://localhost:3005", // Feed service
    prefix: "/feed",
    rewritePrefix: "",
    http2: false,
  });

  // Add a fallback route for debugging
  app.get("/", async () => ({
    message: "API Gateway is running",
    services: {
      auth: "http://localhost:3005/auth",
      user: "http://localhost:3001/users",
      post: "http://localhost:3003/posts",
      comment: "http://localhost:3002/comments",
      search: "http://localhost:3004/search",
    },
  }));

  return app;
};
