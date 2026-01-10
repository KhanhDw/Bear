import { FastifyRequest, FastifyReply } from "fastify";
import {
  createCommentService,
  getCommentsService,
  getCommentByIdService,
  getCommentsByPostIdService,
  getCommentsByUserIdService,
  updateCommentService,
  deleteCommentService,
} from "./comment.service.js";
import { CreateCommentInput, UpdateCommentInput } from "./comment.types.js";

/* CREATE */
export const createComment = async (
  req: FastifyRequest<{ Body: CreateCommentInput }>,
  reply: FastifyReply
) => {
  const comment = await createCommentService(req.body);
  reply.code(201).send(comment);
};

/* READ ALL */
export const getComments = async (_req: FastifyRequest, reply: FastifyReply) => {
  const comments = await getCommentsService();
  reply.send(comments);
};

/* READ BY POST ID */
export const getCommentsByPost = async (
  req: FastifyRequest<{ Querystring: { post_id: string } }>,
  reply: FastifyReply
) => {
  const comments = await getCommentsByPostIdService(req.query.post_id);
  reply.send(comments);
};

/* READ BY USER ID */
export const getCommentsByUser = async (
  req: FastifyRequest<{ Querystring: { user_id: string } }>,
  reply: FastifyReply
) => {
  const comments = await getCommentsByUserIdService(req.query.user_id);
  reply.send(comments);
};

/* READ ONE */
export const getCommentById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const comment = await getCommentByIdService(req.params.id);

  if (!comment) {
    return reply.code(404).send({ message: "Comment not found" });
  }

  reply.send(comment);
};

/* UPDATE */
export const updateComment = async (
  req: FastifyRequest<{
    Params: { id: string };
    Body: UpdateCommentInput;
  }>,
  reply: FastifyReply
) => {
  const comment = await updateCommentService(req.params.id, req.body);

  if (!comment) {
    return reply.code(404).send({ message: "Comment not found" });
  }

  reply.send(comment);
};

/* DELETE */
export const deleteComment = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const success = await deleteCommentService(req.params.id);

  if (!success) {
    return reply.code(404).send({ message: "Comment not found" });
  }

  reply.code(204).send();
};