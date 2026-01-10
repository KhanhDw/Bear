import { CreateCommentInput, UpdateCommentInput, Comment } from "./comment.types.js";
import { randomUUID } from "crypto";
import { pool } from "../../db/db.js";

/* CREATE */
export const insertComment = async (input: CreateCommentInput): Promise<Comment> => {
  const result = await pool.query(
    `
    INSERT INTO comments (
      comment_id,
      post_id,
      user_id,
      content,
      comment_created_at,
      comment_updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $5)
    RETURNING *
    `,
    [
      randomUUID(),
      input.post_id,
      input.user_id,
      input.content,
      new Date()
    ]
  );

  return result.rows[0];
};

/* READ - all */
export const getAllComments = async (): Promise<Comment[]> => {
  const result = await pool.query(
    `
    SELECT *
    FROM comments
    ORDER BY comment_created_at DESC
    `
  );

  return result.rows;
};

/* READ - by id */
export const getCommentById = async (comment_id: string): Promise<Comment | null> => {
  const result = await pool.query(
    `
    SELECT *
    FROM comments
    WHERE comment_id = $1
    `,
    [comment_id]
  );

  return result.rows[0] || null;
};

/* READ - by post_id */
export const getCommentsByPostId = async (post_id: string): Promise<Comment[]> => {
  const result = await pool.query(
    `
    SELECT *
    FROM comments
    WHERE post_id = $1
    ORDER BY comment_created_at ASC
    `,
    [post_id]
  );

  return result.rows;
};

/* READ - by user_id */
export const getCommentsByUserId = async (user_id: string): Promise<Comment[]> => {
  const result = await pool.query(
    `
    SELECT *
    FROM comments
    WHERE user_id = $1
    ORDER BY comment_created_at DESC
    `,
    [user_id]
  );

  return result.rows;
};

/* UPDATE */
export const updateComment = async (
  comment_id: string,
  input: UpdateCommentInput
): Promise<Comment | null> => {
  const result = await pool.query(
    `
    UPDATE comments
    SET content = $1, comment_updated_at = $2
    WHERE comment_id = $3
    RETURNING *
    `,
    [input.content, new Date(), comment_id]
  );

  return result.rows[0] || null;
};

/* DELETE */
export const deleteComment = async (comment_id: string): Promise<boolean> => {
  const result = await pool.query(
    `
    DELETE FROM comments
    WHERE comment_id = $1
    `,
    [comment_id]
  );

  return result.rowCount === 1;
};