import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import Fastify from "fastify";
import { HealthChecker, registerHealthEndpoints } from '../../../libs/health/src/health.check.js';
import { KafkaManager } from '../../../libs/kafka/src/kafka.manager.js';
import { logger } from '../../../libs/logger/src/structured.logger.js';
import { traceMiddleware } from '../../../libs/middleware/src/trace.middleware.js';
import { OutboxPublisher } from '../../../libs/outbox/src/outbox.publisher.js';
import { RedisManager } from '../../../libs/redis/src/redis.manager.js';
import { GracefulShutdown } from '../../../libs/reliability/src/graceful.shutdown.js';
import { env } from './config/env.js';
import { pool } from './db/db.js';
import userRoutes from "./modules/user/user.routes.js";

// Global instances

let kafkaManager: KafkaManager;
let redisManager: RedisManager;
let healthChecker: HealthChecker;
let outboxPublisher: OutboxPublisher;

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
    logger.info('Database connected');

    // Initialize Kafka
    kafkaManager = new KafkaManager({
      clientId: 'user-service',
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

    // Initialize outbox publisher
    outboxPublisher = new OutboxPublisher(pool, kafkaManager);
    
    // Initialize graceful shutdown
    const gracefulShutdown = new GracefulShutdown(app);
    gracefulShutdown.addCleanupTask(async () => GracefulShutdown.closeDatabase(pool));
    gracefulShutdown.addCleanupTask(async () => GracefulShutdown.closeKafka(kafkaManager['kafka']));
    gracefulShutdown.addCleanupTask(async () => GracefulShutdown.closeRedis(redisManager['client']));

    // Swagger spec (OpenAPI 3)
    app.register(swagger);

    // Swagger UI
    app.register(swaggerUI, {
      routePrefix: "/docs",
    });

    // Add trace middleware
    app.addHook('onRequest', traceMiddleware);

    // Register health endpoints
    registerHealthEndpoints(app, healthChecker);

    app.addHook("onRequest", async (req) => {
      console.log(`[USER-SERVICE] ${req.method} ${req.url}`);
    });

    // Register user routes
    app.register(userRoutes);

    // Start outbox publisher
    outboxPublisher.startPolling();

    return app;
  } catch (error) {
    logger.error('Failed to initialize user service', error);
    throw error;
  }
};