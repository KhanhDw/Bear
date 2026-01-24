import 'fastify';
// KHÔNG được viết lại toàn bộ interface
// → chỉ extend thêm property
declare module 'fastify' {
  interface FastifyRequest {
    requestLogger?: {
      bindings(): {
        traceId?: string;
      };
    };
  }
}
