// libs/utils/logger.ts
import pino, { Logger as PinoLogger } from 'pino';
import { v4 as uuidv4 } from 'uuid';

export interface LogContext {
  correlationId?: string;
  userId?: string;
  service?: string;
  operation?: string;
}

export class Logger {
  private logger: PinoLogger;
  private serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
    this.logger = pino({
      level: process.env.LOG_LEVEL || 'info',
      transport: process.env.NODE_ENV === 'development' ? {
        target: 'pino-pretty',
        options: {
          colorize: true
        }
      } : undefined,
      base: {
        service: serviceName
      }
    });
  }

  private getContext(context?: LogContext) {
    return {
      correlationId: context?.correlationId || uuidv4(),
      userId: context?.userId,
      service: context?.service || this.serviceName,
      operation: context?.operation
    };
  }

  info(msg: string, context?: LogContext): void {
    const ctx = this.getContext(context);
    this.logger.info(ctx, msg);
  }

  warn(msg: string, context?: LogContext): void {
    const ctx = this.getContext(context);
    this.logger.warn(ctx, msg);
  }

  error(error: Error | string, context?: LogContext): void {
    const ctx = this.getContext(context);
    if (typeof error === 'string') {
      this.logger.error(ctx, error);
    } else {
      this.logger.error(ctx, error, error.message);
    }
  }

  debug(msg: string, context?: LogContext): void {
    const ctx = this.getContext(context);
    this.logger.debug(ctx, msg);
  }

  child(context: LogContext): Logger {
    const childLogger = new Logger(this.serviceName);
    childLogger.logger = this.logger.child(context);
    return childLogger;
  }
}