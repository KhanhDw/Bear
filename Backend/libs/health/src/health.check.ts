import { FastifyInstance } from 'fastify';
import { Pool } from 'pg';
import { Kafka } from 'kafkajs';
import { Redis } from 'ioredis';

export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    [key: string]: {
      status: 'up' | 'down';
      responseTime?: number;
      error?: string;
    };
  };
  timestamp: string;
}

export class HealthChecker {
  constructor(
    private dbPool?: Pool,
    private kafkaClient?: Kafka,
    private redisClient?: Redis
  ) {}

  async check(): Promise<HealthCheck> {
    const startTime = Date.now();
    const checks: HealthCheck['checks'] = {};

    // Database check
    if (this.dbPool) {
      try {
        const dbStartTime = Date.now();
        await this.dbPool.query('SELECT 1');
        checks.database = {
          status: 'up',
          responseTime: Date.now() - dbStartTime
        };
      } catch (error) {
        checks.database = {
          status: 'down',
          error: (error as Error).message
        };
      }
    }

    // Kafka check
    if (this.kafkaClient) {
      try {
        const kafkaStartTime = Date.now();
        await this.kafkaClient.admin().connect();
        await this.kafkaClient.admin().disconnect();
        checks.kafka = {
          status: 'up',
          responseTime: Date.now() - kafkaStartTime
        };
      } catch (error) {
        checks.kafka = {
          status: 'down',
          error: (error as Error).message
        };
      }
    }

    // Redis check
    if (this.redisClient) {
      try {
        const redisStartTime = Date.now();
        await this.redisClient.ping();
        checks.redis = {
          status: 'up',
          responseTime: Date.now() - redisStartTime
        };
      } catch (error) {
        checks.redis = {
          status: 'down',
          error: (error as Error).message
        };
      }
    }

    // Overall status
    const hasDownChecks = Object.values(checks).some(check => check.status === 'down');
    const hasSlowChecks = Object.values(checks).some(check => 
      check.responseTime && check.responseTime > 1000
    );

    const status = hasDownChecks ? 'unhealthy' : 
                  hasSlowChecks ? 'degraded' : 'healthy';

    return {
      status,
      checks,
      timestamp: new Date().toISOString()
    };
  }
}

export const registerHealthEndpoints = (
  server: FastifyInstance,
  healthChecker: HealthChecker
) => {
  server.get('/health', async (_, reply) => {
    const health = await healthChecker.check();
    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 200 : 503;
    reply.status(statusCode).send(health);
  });

  server.get('/ready', async (_, reply) => {
    // Ready check - similar to health but indicates readiness to serve traffic
    const health = await healthChecker.check();
    const isReady = health.status !== 'unhealthy';
    const statusCode = isReady ? 200 : 503;
    reply.status(statusCode).send({ 
      status: isReady ? 'ready' : 'not_ready',
      timestamp: new Date().toISOString()
    });
  });

  server.get('/metrics', async (_, reply) => {
    // Basic metrics endpoint
    const metrics = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      timestamp: new Date().toISOString()
    };
    reply.send(metrics);
  });
};