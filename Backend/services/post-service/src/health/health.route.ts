import { FastifyReply, FastifyRequest } from "fastify";

export const health = async (req: FastifyRequest, reply: FastifyReply) => {
  return { status: "post service ok baby" };
};
