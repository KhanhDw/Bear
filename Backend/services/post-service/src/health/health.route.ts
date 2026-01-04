import { FastifyRequest, FastifyReply } from "fastify";

export const health = async (req: FastifyRequest, reply: FastifyReply) => {
  return { status: "ok baby 1" };
};
