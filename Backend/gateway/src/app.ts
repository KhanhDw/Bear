// gateway/src/app.ts
import Fastify from "fastify";
import proxy from "@fastify/http-proxy";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
// import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";

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
    origin: "*", // In production, specify exact origins
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // Rate limiting
  app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  // JWT authentication - turn off authories to test - production should turn on it
  // app.register(jwt, {
  //   secret: process.env.JWT_SECRET || "supersecretkey",
  // });

  // Health check endpoint
  app.get("/health", async () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      post: "http://localhost:3000",
      user: "http://localhost:3001",
      comment: "http://localhost:3002",
      search: "http://localhost:3004",
    },
  }));

  // Authentication middleware
  app.addHook("preHandler", async (request, reply) => {
    // Skip authentication for health checks and login/register endpoints
    if (
      request.url.startsWith("/health") ||
      request.url.includes("/auth/login") ||
      request.url.includes("/auth/register")
    ) {
      return;
    }

    // Add authentication to protected routes
    if (
      request.url.startsWith("/users") ||
      request.url.startsWith("/posts") ||
      request.url.startsWith("/comments") ||
      request.url.startsWith("/search")
    ) {
      try {
        //
        // await request.jwtVerify();
      } catch (err) {
        return reply.status(401).send({ error: "Unauthorized" });
      }
    }
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
    upstream: "http://localhost:3000", // Post service
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

  // Add a fallback route for debugging
  app.get("/", async () => ({
    message: "API Gateway is running",
    services: {
      user: "http://localhost:3001/users",
      post: "http://localhost:3000/posts",
      comment: "http://localhost:3002/comments",
      search: "http://localhost:3004/search",
    },
  }));

  return app;
};
