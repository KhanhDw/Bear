import { Pool } from 'pg';
import { Kafka } from 'kafkajs';
import { Redis } from 'ioredis';
import { FastifyInstance } from 'fastify';
import { logger } from '../../logger/src/structured.logger.js';

export class GracefulShutdown {
  private shutdownInProgress = false;
  private cleanupTasks: Array<() => Promise<void>> = [];

  constructor(private server: FastifyInstance) {
    this.setupSignalHandlers();
  }

  addCleanupTask(task: () => Promise<void>) {
    this.cleanupTasks.push(task);
  }

  private setupSignalHandlers() {
    process.on('SIGTERM', () => this.handleShutdown('SIGTERM'));
    process.on('SIGINT', () => this.handleShutdown('SIGINT'));
    process.on('SIGUSR2', () => this.handleShutdown('SIGUSR2')); // nodemon restart
  }

  private async handleShutdown(signal: string) {
    if (this.shutdownInProgress) {
      logger.warn('Shutdown already in progress, ignoring signal:', signal);
      return;
    }

    this.shutdownInProgress = true;
    logger.info(`Received ${signal}, starting graceful shutdown`);

    try {
      // Stop accepting new requests
      await this.server.close();

      // Run cleanup tasks
      for (const task of this.cleanupTasks) {
        try {
          await task();
          logger.info('Completed cleanup task');
        } catch (error) {
          logger.error('Error during cleanup task:', error);
        }
      }

      logger.info('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  }

  static async closeDatabase(pool: Pool) {
    logger.info('Closing database connections...');
    await pool.end();
    logger.info('Database connections closed');
  }

  static async closeKafka(kafka: Kafka) {
    logger.info('Closing Kafka connections...');
    await kafka.admin().disconnect();
    logger.info('Kafka connections closed');
  }

  static async closeRedis(redis: Redis) {
    logger.info('Closing Redis connections...');
    await redis.quit();
    logger.info('Redis connections closed');
  }
}