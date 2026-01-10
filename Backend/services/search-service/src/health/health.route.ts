import { FastifyRequest, FastifyReply } from "fastify";

export const health = async (_req: FastifyRequest, reply: FastifyReply) => {
  reply.send({ status: "ok", timestamp: new Date().toISOString() });
};