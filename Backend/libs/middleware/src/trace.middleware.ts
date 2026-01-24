import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import { logger } from '../../logger/src/structured.logger.js';

export const traceMiddleware = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  // Generate or propagate trace ID
  const traceId = req.headers['x-trace-id'] as string || crypto.randomUUID();
  const userId = req.headers['x-user-id'] as string;

  req.headers['x-trace-id'] = traceId;

  // Add to logger context
  const requestLogger = logger.child({ traceId, userId });

  // Attach to request for use in handlers
  (req as any).requestLogger = requestLogger;

  // Add to response headers
  reply.header('x-trace-id', traceId);
};
