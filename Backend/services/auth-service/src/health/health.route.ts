import { FastifyRequest, FastifyReply } from "fastify";

export const health = async (req: FastifyRequest, reply: FastifyReply) => {
  return { status: "auth-service ok baby" };
};
