import pino from 'pino';

// Create a logger instance with custom configuration
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' 
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        }
      } 
    : undefined,
  base: {
    service: process.env.SERVICE_NAME || 'unknown-service',
    version: process.env.npm_package_version || '1.0.0',
  },
});

export default logger;