import cookie from "@fastify/cookie";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { KafkaManager } from "@libs/kafka/src/kafka.manager"; // có package kafka.manager.ts mới dùng được alias @libs/kafka
import Fastify from "fastify";
import {
  HealthChecker,
  registerHealthEndpoints,
} from "../../../libs/health/src/health.check";
import { logger } from "../../../libs/logger/src/structured.logger";
import { RedisManager } from "../../../libs/redis/src/redis.manager";
import { env } from "./config/env";
import { pool } from "./db/db";
import { authRoutes } from "./modules/auth/auth.routes.js";

// Global instances
let kafkaManager: KafkaManager;
let redisManager: RedisManager;
let healthChecker: HealthChecker;

export const buildApp = async () => {
  const app = Fastify({
    logger: {
      transport: {
        target: "pino-pretty",
      },
    },
  });
  try {
    // Initialize database pool
    const result = await pool.query("SELECT 1"); // Test connection
    if (result.rowCount !== 1) {
      throw new Error("Database connection failed");
    }
    logger.info("Database connected");

    // Initialize Kafka
    kafkaManager = new KafkaManager({
      clientId: "post-service",
      brokers: [env.KAFKA_BROKERS],
    });
    await kafkaManager.connect();
    logger.info("Kafka connected");

    // Initialize Redis
    redisManager = new RedisManager({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD,
      db: 0,
    });
    await redisManager.connect();
    logger.info("Redis connected");

    // Initialize health checker
    healthChecker = new HealthChecker(
      pool,
      kafkaManager["kafka"],
      redisManager["client"],
    );

    app.addHook("onRequest", async (req) => {
      console.log(`[AUTH-SERVICE] ${req.method} ${req.url}`);
    });

    // Register health endpoints
    registerHealthEndpoints(app, healthChecker);

    app.register(cookie, {
      secret: "my-secret",
    });

    // Swagger spec (OpenAPI 3)
    app.register(swagger);

    // Swagger UI
    app.register(swaggerUI, {
      routePrefix: "/docs",
    });

    app.register(authRoutes);

    return app;
  } catch (error) {
    logger.error("Failed to initialize auth service", error);
    throw error;
  }
};
