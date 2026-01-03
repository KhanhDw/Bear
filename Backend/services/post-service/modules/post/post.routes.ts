import { FastifyInstance } from "fastify";
import { createPost } from "./post.controller.js";
import { createPostSchema } from "./post.schema.js";

export default async function postRoutes(app: FastifyInstance) {
  // app.post("/", { schema: createPostSchema }, createPost);
  app.get("/", async () => {
    return [{ id: 1, title: "Hello from post-service" }];
  });
}
