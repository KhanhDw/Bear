import { FastifyInstance } from "fastify";
import { createPost, getPosts } from "./post.controller.js";
import { createPostSchema } from "./post.schema.js";

export default async function postRoutes(app: FastifyInstance) {
  app.post("/", { schema: createPostSchema }, createPost);
  app.get("/all", getPosts);
}
