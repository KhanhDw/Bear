import { FastifyInstance } from 'fastify';
import { env } from '../config/env.js';

export const registerHealthCheck = (server: FastifyInstance) => {
  // Health check endpoint
  server.get('/health', async (_, reply) => {
    // Here you could add checks for database connectivity, external services, etc.
    const healthCheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
      env: env.NODE_ENV,
    };
    
    try {
      // Add any additional health checks here (database, external services, etc.)
      reply.status(200).send(healthCheck);
    } catch (e) {
      healthCheck.message = 'ERROR';
      reply.status(503).send(healthCheck);
    }
  });

  // Ready check endpoint
  server.get('/ready', async (_, reply) => {
    // Check if the service is ready to accept requests
    // This could include checking database connections, etc.
    reply.status(200).send({ status: 'ready' });
  });
};