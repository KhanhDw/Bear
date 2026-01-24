import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import Fastify, { FastifyRequest } from "fastify";
import { HealthChecker, registerHealthEndpoints } from '../../../libs/health/src/health.check.js';
import { KafkaManager } from '../../../libs/kafka/src/kafka.manager.js';
import { logger } from '../../../libs/logger/src/structured.logger.js';
import { traceMiddleware } from '../../../libs/middleware/src/trace.middleware.js';
import { RedisManager } from '../../../libs/redis/src/redis.manager.js';
import { env } from './config/env.js';
import { pool } from "./db/db.js";
import postRoutes from "./modules/post/post.routes.js";

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
    const result = await pool.query('SELECT 1'); // Test connection
    if (result.rowCount !== 1) {
      throw new Error('Database connection failed');
    }
    logger.info('Database connected');

    // Initialize Kafka
    kafkaManager = new KafkaManager({
      clientId: 'post-service',
      brokers: [env.KAFKA_BROKERS]
    });
    await kafkaManager.connect();
    logger.info('Kafka connected');

    // Initialize Redis
    redisManager = new RedisManager({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD,
      db: 0
    });
    await redisManager.connect();
    logger.info('Redis connected');

    // Initialize health checker
    healthChecker = new HealthChecker(pool, kafkaManager['kafka'], redisManager['client']);
    // Register health endpoints
    registerHealthEndpoints(app, healthChecker);


    // Swagger spec (OpenAPI 3)
    app.register(swagger);

    // Swagger UI
    app.register(swaggerUI, {
      routePrefix: "/docs",
    });



    app.addHook("onRequest", async (req: FastifyRequest) => {
      console.log(`[POST-SERVICE] ${req.method} ${req.url}`);
    });

    // Register post routes
    app.register(postRoutes);
    app.addHook('onRequest', traceMiddleware);

    return app;
  } catch (error) {
    logger.error('Failed to initialize post service', error);
    throw error;
  }
};
