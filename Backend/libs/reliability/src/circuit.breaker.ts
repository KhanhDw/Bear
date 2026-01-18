import CircuitBreaker from 'opossum';
import { logger } from '../../logger/src/structured.logger.js';

export interface CircuitBreakerOptions {
  timeout?: number;
  errorThresholdPercentage?: number;
  resetTimeout?: number;
  maxFailures?: number;
  rollingCountTimeout?: number;
  rollingCountBuckets?: number;
}

export class ServiceReliability {
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();

  constructor() {}

  createCircuitBreaker<T>(
    serviceName: string,
    fn: (...args: any[]) => Promise<T>,
    options: CircuitBreakerOptions = {}
  ): CircuitBreaker {
    const circuitBreaker = new CircuitBreaker(fn, {
      timeout: options.timeout || 3000,
      errorThresholdPercentage: options.errorThresholdPercentage || 50,
      resetTimeout: options.resetTimeout || 30000,
      maxFailures: options.maxFailures || 3,
      rollingCountTimeout: options.rollingCountTimeout || 10000,
      rollingCountBuckets: options.rollingCountBuckets || 10,
      name: serviceName,
      cache: false
    });

    circuitBreaker.on('success', () => {
      logger.info(`Circuit breaker ${serviceName} succeeded`);
    });

    circuitBreaker.on('failure', (err) => {
      logger.error(`Circuit breaker ${serviceName} failed`, err);
    });

    circuitBreaker.on('timeout', () => {
      logger.warn(`Circuit breaker ${serviceName} timed out`);
    });

    circuitBreaker.on('reject', () => {
      logger.warn(`Circuit breaker ${serviceName} rejected (open state)`);
    });

    circuitBreaker.on('halfOpen', () => {
      logger.info(`Circuit breaker ${serviceName} half-open (testing)`);
    });

    circuitBreaker.on('close', () => {
      logger.info(`Circuit breaker ${serviceName} closed (normal operation)`);
    });

    circuitBreaker.on('open', () => {
      logger.warn(`Circuit breaker ${serviceName} opened (failing fast)`);
    });

    this.circuitBreakers.set(serviceName, circuitBreaker);
    return circuitBreaker;
  }

  async executeWithCircuitBreaker<T>(
    serviceName: string,
    fn: (...args: any[]) => Promise<T>,
    args: any[],
    options: CircuitBreakerOptions = {}
  ): Promise<T> {
    const cb = this.createCircuitBreaker(serviceName, fn, options);
    return cb.fire(...args);
  }
}

export const serviceReliability = new ServiceReliability();