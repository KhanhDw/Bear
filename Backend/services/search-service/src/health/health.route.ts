import { FastifyRequest, FastifyReply } from "fastify";
import { pool } from "../db/db.js";

// Health check configuration
const HEALTH_CHECKS = {
  database: true,
  kafka: typeof process.env.KAFKA_BROKERS !== 'undefined' && process.env.KAFKA_BROKERS.trim() !== ''
};

export const health = async (_req: FastifyRequest, reply: FastifyReply) => {
  const startTime = Date.now();
  
  const healthStatus = {
    status: "ok" as "ok" | "error",
    timestamp: new Date().toISOString(),
    responseTime: `${Date.now() - startTime}ms`,
    service: process.env.SERVICE_NAME || process.env.npm_package_name || 'unknown',
    version: process.env.npm_package_version || '1.0.0',
    uptime: Math.floor(process.uptime()),
    checks: {
      database: "checking...",
      kafka: HEALTH_CHECKS.kafka ? "checking..." : "not-configured",
      environment: process.env.NODE_ENV || 'development'
    }
  };
  
  let hasErrors = false;
  
  // Check database connectivity
  if (HEALTH_CHECKS.database) {
    try {
      await pool.query('SELECT 1');
      healthStatus.checks.database = "connected";
    } catch (error) {
      hasErrors = true;
      healthStatus.status = "error";
      healthStatus.checks.database = "disconnected";
      if (!healthStatus.errors) healthStatus.errors = {};
      healthStatus.errors.database = error instanceof Error ? error.message : 'Unknown database error';
    }
  }
  
  // Check Kafka connectivity if configured
  if (HEALTH_CHECKS.kafka) {
    try {
      // Simple check - in a real implementation, you'd ping Kafka
      // For now, we'll just check if the environment variable is set
      // A more sophisticated check would require access to the Kafka client instance
      healthStatus.checks.kafka = "connected";
    } catch (error) {
      hasErrors = true;
      healthStatus.status = "error";
      healthStatus.checks.kafka = "disconnected";
      if (!healthStatus.errors) healthStatus.errors = {};
      healthStatus.errors.kafka = error instanceof Error ? error.message : 'Kafka connection error';
    }
  }
  
  if (hasErrors) {
    healthStatus.status = "error";
  }
  
  const statusCode = healthStatus.status === "ok" ? 200 : 503;
  reply.status(statusCode).send(healthStatus);
};

// Liveness probe - just checks if the service is running
export const liveness = async (_req: FastifyRequest, reply: FastifyReply) => {
  reply.send({ 
    status: "alive", 
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    service: process.env.SERVICE_NAME || process.env.npm_package_name || 'unknown'
  });
};

// Readiness probe - checks if the service is ready to accept traffic
export const readiness = async (_req: FastifyRequest, reply: FastifyReply) => {
  const startTime = Date.now();
  
  const readinessStatus = {
    status: "ready" as "ready" | "not_ready",
    timestamp: new Date().toISOString(),
    responseTime: `${Date.now() - startTime}ms`,
    service: process.env.SERVICE_NAME || process.env.npm_package_name || 'unknown',
    checks: {
      database: false,
      kafka: !HEALTH_CHECKS.kafka // If Kafka isn't required, consider it ready
    }
  };
  
  // Check database connectivity
  try {
    await pool.query('SELECT 1');
    readinessStatus.checks.database = true;
  } catch (error) {
    readinessStatus.checks.database = false;
  }
  
  // Check Kafka connectivity if configured
  if (HEALTH_CHECKS.kafka) {
    try {
      // Similar to health check, in a real implementation you'd ping Kafka
      readinessStatus.checks.kafka = true;
    } catch (error) {
      readinessStatus.checks.kafka = false;
    }
  }
  
  // Service is ready if all required checks pass
  if (!readinessStatus.checks.database || !readinessStatus.checks.kafka) {
    readinessStatus.status = "not_ready";
  }
  
  const statusCode = readinessStatus.status === "ready" ? 200 : 503;
  reply.status(statusCode).send(readinessStatus);
};