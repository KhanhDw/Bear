import { FastifyRequest } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    cookies: { [key: string]: string | undefined };
  }
}
