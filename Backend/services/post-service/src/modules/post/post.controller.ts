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
  try {
    const traceId = req.requestLogger?.bindings().traceId;

    const post = await createPostService(req.body, { traceId });

    reply.code(201).send(post);
  } catch (error: any) {
    reply.status(400).send({ message: error.message });
  }
};


/* READ ALL */
export const getPosts = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    // Extract query parameters for pagination and filtering
    const { limit, offset, author, search } = req.query as any;

    const options = {
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined,
      post_author_id: author as string,
      search: search as string,
    };

    const result = await getPostsService(options);
    reply.send(result);
  } catch (error: any) {
    reply.status(500).send({ message: error.message });
  }
};

/* READ ONE */
export const getPostById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const post = await getPostByIdService(req.params.id);

    if (!post) {
      return reply.code(404).send({ message: "Post not found" });
    }

    reply.send(post);
  } catch (error: any) {
    reply.status(400).send({ message: error.message });
  }
};

/* UPDATE */
export const updatePost = async (
  req: FastifyRequest<{
    Params: { id: string };
    Body: UpdatePostInput;
  }>,
  reply: FastifyReply
) => {
  try {
    const ctx = { traceId: req.requestLogger?.bindings().traceId };

    // In a real implementation, you would extract the current user from authentication
    // For now, we'll pass a mock user or undefined
    const currentUser = req.headers.authorization ? { userId: 'mock-user-id' } : undefined;

    const post = await updatePostService(req.params.id, req.body, currentUser, ctx);

    if (!post) {
      return reply.code(404).send({ message: "Post not found" });
    }

    reply.send(post);
  } catch (error: any) {
    if (error.message.includes('authorized')) {
      reply.status(403).send({ message: error.message });
    } else {
      reply.status(400).send({ message: error.message });
    }
  }
};

/* DELETE */
export const deletePost = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    // In a real implementation, you would extract the current user from authentication
    // For now, we'll pass a mock user or undefined
    const currentUser = req.headers.authorization ? { userId: 'mock-user-id' } : undefined;

    const success = await deletePostService(req.params.id, currentUser);

    if (!success) {
      return reply.code(404).send({ message: "Post not found" });
    }

    reply.code(204).send();
  } catch (error: any) {
    if (error.message.includes('authorized')) {
      reply.status(403).send({ message: error.message });
    } else {
      reply.status(400).send({ message: error.message });
    }
  }
};
