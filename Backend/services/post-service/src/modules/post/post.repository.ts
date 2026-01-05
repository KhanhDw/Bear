import { CreatePostInput, UpdatePostInput, Post } from "./post.types.js";
import { randomUUID } from "crypto";
import { pool } from "../../db/db.js";

/* CREATE */
export const insertPost = async (input: CreatePostInput): Promise<Post> => {
  const result = await pool.query(
    `
    INSERT INTO post (
      post_id,
      post_content,
      post_author_id,
      post_created_at
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [randomUUID(), input.post_content, input.post_author_id, new Date()]
  );

  return result.rows[0];
};

/* READ - all */
export const getAllPosts = async (): Promise<Post[]> => {
  const result = await pool.query(
    `
    SELECT *
    FROM post
    ORDER BY post_created_at DESC
    `
  );

  return result.rows;
};

/* READ - by id */
export const getPostById = async (post_id: string): Promise<Post | null> => {
  const result = await pool.query(
    `
    SELECT *
    FROM post
    WHERE post_id = $1
    `,
    [post_id]
  );

  return result.rows[0] || null;
};

/* UPDATE */
export const updatePost = async (
  post_id: string,
  input: UpdatePostInput
): Promise<Post | null> => {
  const result = await pool.query(
    `
    UPDATE post
    SET post_content = $1
    WHERE post_id = $2
    RETURNING *
    `,
    [input.post_content, post_id]
  );

  return result.rows[0] || null;
};

/* DELETE */
export const deletePost = async (post_id: string): Promise<boolean> => {
  const result = await pool.query(
    `
    DELETE FROM post
    WHERE post_id = $1
    `,
    [post_id]
  );

  return result.rowCount === 1;
};
