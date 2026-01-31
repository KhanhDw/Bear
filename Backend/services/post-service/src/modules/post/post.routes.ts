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
  app.get("/", {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'integer', minimum: 1, maximum: 100 },
          offset: { type: 'integer', minimum: 0 },
          author: { type: 'string' },
          search: { type: 'string' }
        }
      }
    }
  }, getPosts);
  app.get("/:id", getPostById);
  app.put("/:id", { schema: updatePostSchema }, updatePost);
  app.delete("/:id", deletePost);

}
