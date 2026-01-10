import { FastifyInstance } from "fastify";
import {
  createComment,
  getComments,
  getCommentsByPost,
  getCommentsByUser,
  getCommentById,
  updateComment,
  deleteComment,
} from "./comment.controller.js";
import { createCommentSchema, updateCommentSchema } from "./comment.schema.js";
import { health } from "../../health/health.route.js";

export default async function commentRoutes(app: FastifyInstance) {
  app.post("/", { schema: createCommentSchema }, createComment);
  app.get("/", getComments);
  app.get("/by-post", getCommentsByPost);
  app.get("/by-user", getCommentsByUser);
  app.get("/:id", getCommentById);
  app.put("/:id", { schema: updateCommentSchema }, updateComment);
  app.delete("/:id", deleteComment);

  app.get("/health", health);
}