import { FastifyReply, FastifyRequest } from "fastify";
import {
  createPostService,
  deletePostService,
  getPostByIdService,
  getPostsService,
  updatePostService,
} from "./post.service.js";
import { CreatePostInput, UpdatePostInput } from "./post.types.js";

/* CREATE */
export const createPost = async (
  req: FastifyRequest<{ Body: CreatePostInput }>,
  reply: FastifyReply
) => {
  const traceId = req.requestLogger?.bindings().traceId;

  const post = await createPostService(req.body, { traceId });

  reply.code(201).send(post);
};


/* READ ALL */
export const getPosts = async (_req: FastifyRequest, reply: FastifyReply) => {
  const posts = await getPostsService();
  reply.send(posts);
};

/* READ ONE */
export const getPostById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const post = await getPostByIdService(req.params.id);

  if (!post) {
    return reply.code(404).send({ message: "Post not found" });
  }

  reply.send(post);
};

/* UPDATE */
export const updatePost = async (
  req: FastifyRequest<{
    Params: { id: string };
    Body: UpdatePostInput;
  }>,
  reply: FastifyReply
) => {
  const ctx = { traceId: req.requestLogger?.bindings().traceId };
  const post = await updatePostService(req.params.id, req.body, ctx);

  if (!post) {
    return reply.code(404).send({ message: "Post not found" });
  }

  reply.send(post);
};

/* DELETE */
export const deletePost = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const success = await deletePostService(req.params.id);

  if (!success) {
    return reply.code(404).send({ message: "Post not found" });
  }

  reply.code(204).send();
};
