import { CreatePostInput, Post } from "./post.types.js";
import { randomUUID } from "crypto";

export const insertPost = async (input: CreatePostInput): Promise<Post> => {
  // giả lập Mongo
  return {
    id: randomUUID(),
    ...input,
    updatedAt: new Date(),
    createdAt: new Date(),
  };
};
