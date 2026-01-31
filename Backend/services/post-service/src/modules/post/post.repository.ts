import { CreatePostInput, UpdatePostInput, Post, ListPostsInput } from "./post.types.js";
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

/* READ - all with pagination and filtering */
export const getAllPosts = async (options?: ListPostsInput): Promise<{posts: Post[], total: number}> => {
  // Build dynamic query based on options
  let query = 'SELECT * FROM post';
  let countQuery = 'SELECT COUNT(*) FROM post';
  const params: any[] = [];
  const countParams: any[] = [];

  const conditions: string[] = [];

  if (options?.post_author_id) {
    conditions.push(`post_author_id = $${params.length + 1}`);
    params.push(options.post_author_id);
    countParams.push(options.post_author_id);
  }

  if (options?.search) {
    conditions.push(`post_content ILIKE $${params.length + 1}`);
    params.push(`%${options.search}%`);
    countParams.push(`%${options.search}%`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
    countQuery += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY post_created_at DESC';

  // Add pagination
  if (options?.limit && options.limit > 0) {
    query += ` LIMIT $${params.length + 1}`;
    params.push(options.limit);
  }

  if (options?.offset && options.offset >= 0) {
    query += ` OFFSET $${params.length + 1}`;
    params.push(options.offset);
  }

  // Execute both queries
  const [postsResult, countResult] = await Promise.all([
    pool.query(query, params),
    pool.query(countQuery, countParams)
  ]);

  const total = parseInt(countResult.rows[0].count);

  return {
    posts: postsResult.rows,
    total
  };
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
