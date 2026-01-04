import { CreatePostInput, Post } from "./post.types.js";
import { randomUUID } from "crypto";
import { pool } from "../../db/db.js";

export const insertPost = async (input: CreatePostInput): Promise<Post> => {
  const result = await pool.query(
    "INSERT INTO posts (post_id, post_content, post_author_id, post_created_at) VALUES ($1, $2, $3, $4) RETURNING *",
    [randomUUID(), input.post_content, input.post_author_id, new Date()]
  );
  return result.rows[0];
};
