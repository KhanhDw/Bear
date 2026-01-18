import pino from 'pino';

export interface LogContext {
  traceId?: string;
  userId?: string;
  requestId?: string;
  service?: string;
  version?: string;
}

export class StructuredLogger {
  private logger: pino.Logger;

  constructor(context: LogContext = {}) {
    this.logger = pino({
      level: process.env.LOG_LEVEL || 'info',
      formatters: {
        level(label) {
          return { level: label.toUpperCase() };
        }
      },
      timestamp: pino.stdTimeFunctions.isoTime,
      mixin: () => context
    });
  }

  info(message: string, meta?: any) {
    this.logger.info(meta, message);
  }

  warn(message: string, meta?: any) {
    this.logger.warn(meta, message);
  }

  error(error: Error | string, meta?: any) {
    if (typeof error === 'string') {
      this.logger.error(meta, error);
    } else {
      this.logger.error({
        ...meta,
        error: {
          message: error.message,
          stack: error.stack,
          name: error.name
        }
      }, 'Error occurred');
    }
  }

  debug(message: string, meta?: any) {
    this.logger.debug(meta, message);
  }

  child(context: LogContext): StructuredLogger {
    return new StructuredLogger({ ...this.logger.bindings(), ...context });
  }

  addContext(context: LogContext) {
    Object.assign(this.logger.bindings(), context);
  }
}

// Global logger instance
export const logger = new StructuredLogger({
  service: process.env.SERVICE_NAME || 'unknown',
  version: process.env.npm_package_version || '1.0.0'
});