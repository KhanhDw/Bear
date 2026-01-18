import fastify, { FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import staticPlugin from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';

// Import environment configuration
import { env } from './config/env.js';
import { mediaRoutes } from './modules/media/media.routes.js';

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
await server.register(multipart);
// Serve uploaded files statically
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
await server.register(staticPlugin, {
  root: path.join(__dirname, '..', 'uploads'),
  prefix: '/uploads/', // optional: default '/'
});

// Register routes
server.register(mediaRoutes, { prefix: '/media' });

// Register health check
registerHealthCheck(server);

export { server };