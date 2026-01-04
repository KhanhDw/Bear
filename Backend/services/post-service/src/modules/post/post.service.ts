import { CreatePostInput, Post } from "./post.types.js";
import { insertPost } from "./post.repository.js";
import { publishPostCreated } from "./post.events.js";
import { pool } from "../../db/db.js";

export const createPostService = async (
  input: CreatePostInput
): Promise<Post> => {
  const post = await insertPost(input);
  await publishPostCreated(post);
  return post;
};

export const getPostsService = async (): Promise<Post[]> => {
  const result = await pool.query(
    "SELECT post_id, post_author_id, post_content, post_created_at FROM post"
  );
  return result.rows;
};
