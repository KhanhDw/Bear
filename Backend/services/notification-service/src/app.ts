import fastify, { FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';

// Import environment configuration
import { env } from './config/env.js';
import { notificationRoutes } from './modules/notification/notification.routes.js';

// Import health check
import { registerHealthCheck } from './health/health.check.js';

// Create Fastify instance
const server: FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify({
  logger: true,
});

// Register plugins
await server.register(cors, {
  origin: '*', // Configure appropriately for production
});
await server.register(helmet);

// Register routes
server.register(notificationRoutes, { prefix: '/notifications' });

// Register health check
registerHealthCheck(server);

export { server };