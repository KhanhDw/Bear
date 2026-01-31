import { FastifyReply, FastifyRequest } from "fastify";
import { HealthChecker } from '../../../libs/health/src/health.check.js';

// For gateway, we don't have direct DB/Kafka/Redis connections
// But we can create a basic health checker
const healthChecker = new HealthChecker();

export const health = async (req: FastifyRequest, reply: FastifyReply) => {
  const health = await healthChecker.check();
  const statusCode = health.status === 'healthy' ? 200 :
                    health.status === 'degraded' ? 200 : 503;
  reply.status(statusCode).send(health);
};

export const readiness = async (req: FastifyRequest, reply: FastifyReply) => {
  // Check if the service is ready to accept requests
  // For gateway, check if it can reach other services
  const health = await healthChecker.check();
  const isReady = health.status !== 'unhealthy';
  const statusCode = isReady ? 200 : 503;
  reply.status(statusCode).send({
    status: isReady ? 'ready' : 'not_ready',
    timestamp: new Date().toISOString()
  });
};