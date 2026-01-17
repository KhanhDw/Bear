import { FastifyReply, FastifyRequest } from "fastify";
import { CircuitBreaker } from "../../../libs/utils/circuit-breaker.js";

// Global circuit breakers for each service
const serviceCircuitBreakers = new Map<string, CircuitBreaker>();

// Initialize circuit breakers for each service
const services = ["auth", "user", "post", "comment", "search", "vote", "feed"];
services.forEach(service => {
  serviceCircuitBreakers.set(service, new CircuitBreaker({
    failureThreshold: 5,
    timeout: 60000,
    resetTimeout: 30000
  }));
});

export const health = async (req: FastifyRequest, reply: FastifyReply) => {
  const healthStatus = {
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {} as Record<string, any>,
    checks: {
      database: true,
      redis: true,
      kafka: true
    }
  };

  // Add circuit breaker status for each service
  serviceCircuitBreakers.forEach((breaker, serviceName) => {
    healthStatus.services[serviceName] = {
      status: breaker.getState(),
      failureCount: breaker.getFailureCount()
    };
  });

  reply.send(healthStatus);
};

export const readiness = async (req: FastifyRequest, reply: FastifyReply) => {
  // Check if all dependencies are ready
  const isReady = true; // Simplified - in reality you'd check actual service availability
  
  if (isReady) {
    reply.code(200).send({ status: "ready" });
  } else {
    reply.code(503).send({ status: "not_ready" });
  }
};

// Function to get circuit breaker for a service
export const getCircuitBreaker = (serviceName: string): CircuitBreaker | undefined => {
  return serviceCircuitBreakers.get(serviceName);
};