import { FastifyRequest, FastifyReply } from "fastify";
import { createPostService } from "./post.service.js";
import { CreatePostInput } from "./post.types.js";

export const createPost = async (
  req: FastifyRequest<{ Body: CreatePostInput }>,
  reply: FastifyReply
) => {
  const post = await createPostService(req.body);
  reply.code(201).send(post);
};

export const getPosts = async (req: FastifyRequest, reply: FastifyReply) => {
  return [{ id: 1, title: "Hello from post-service" }];
};
