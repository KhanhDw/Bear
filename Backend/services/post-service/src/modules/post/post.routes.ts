import { FastifyInstance } from "fastify";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from "./post.controller.js";
import { createPostSchema, updatePostSchema } from "./post.schema.js";

export default async function postRoutes(app: FastifyInstance) {
  app.post("/", { schema: createPostSchema }, createPost);
  app.get("/", getPosts);
  app.get("/:id", getPostById);
  app.put("/:id", { schema: updatePostSchema }, updatePost);
  app.delete("/:id", deletePost);

}
