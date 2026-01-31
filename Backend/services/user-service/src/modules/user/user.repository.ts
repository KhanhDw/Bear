import { randomUUID } from "crypto";
import { pool } from "../../db/db.js";
import { CreateUserInput, FollowUserInput, UnfollowUserInput, UpdateUserInput, User } from "./user.types.js";

/* CREATE */
export const insertUser = async (input: CreateUserInput): Promise<User> => {
  const result = await pool.query(
    `
    INSERT INTO users (
      user_id,
      auth_user_id,
      username,
      display_name,
      avatar_url,
      bio,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
    RETURNING
      user_id,
      auth_user_id,
      username,
      display_name,
      avatar_url,
      bio,
      is_active,
      created_at,
      updated_at
    `,
    [
      randomUUID(),
      input.auth_user_id,
      input.username,
      input.display_name || null,
      input.avatar_url || null,
      input.bio || null,
      String(new Date())
    ]
  );

  return result.rows[0];
};

/* READ - all */
export const getAllUsers = async (): Promise<User[]> => {
  const result = await pool.query(
    `
    SELECT
      user_id,
      auth_user_id,
      username,
      display_name,
      avatar_url,
      bio,
      is_active,
      created_at,
      updated_at
    FROM users
    ORDER BY created_at DESC
    `
  );

  return result.rows;
};

/* READ - by id */
export const getUserById = async (user_id: string): Promise<User | null> => {
  const result = await pool.query(
    `
    SELECT
      user_id,
      auth_user_id,
      username,
      display_name,
      avatar_url,
      bio,
      is_active,
      created_at,
      updated_at
    FROM users
    WHERE user_id = $1
    `,
    [user_id]
  );

  return result.rows[0] || null;
};

/* READ - by auth_user_id */
export const getUserByAuthId = async (auth_user_id: string): Promise<User | null> => {
  const result = await pool.query(
    `
    SELECT
      user_id,
      auth_user_id,
      username,
      display_name,
      avatar_url,
      bio,
      is_active,
      created_at,
      updated_at
    FROM users
    WHERE auth_user_id = $1
    `,
    [auth_user_id]
  );

  return result.rows[0] || null;
};

/* UPDATE */
export const updateUser = async (
  user_id: string,
  input: UpdateUserInput
): Promise<User | null> => {
  // Only update fields that are provided
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 2;

  if (input.username) {
    updates.push(`username = $${paramIndex}`);
    values.push(input.username);
    paramIndex++;
  }
  if (input.display_name !== undefined) {
    updates.push(`display_name = $${paramIndex}`);
    values.push(input.display_name);
    paramIndex++;
  }
  if (input.avatar_url !== undefined) {
    updates.push(`avatar_url = $${paramIndex}`);
    values.push(input.avatar_url);
    paramIndex++;
  }
  if (input.bio !== undefined) {
    updates.push(`bio = $${paramIndex}`);
    values.push(input.bio);
    paramIndex++;
  }

  // Always update the updated_at timestamp
  updates.push(`updated_at = $${paramIndex}`);
  values.push(new Date());

  if (updates.length === 0) {
    // If no fields to update, just update the timestamp
    const result = await pool.query(
      `
      UPDATE users
      SET updated_at = $2
      WHERE user_id = $1
      RETURNING
        user_id,
        auth_user_id,
        username,
        display_name,
        avatar_url,
        bio,
        is_active,
        created_at,
        updated_at
      `,
      [user_id, new Date()]
    );
    return result.rows[0] || null;
  }

  const query = `
    UPDATE users
    SET ${updates.join(", ")}
    WHERE user_id = $1
    RETURNING
      user_id,
      auth_user_id,
      username,
      display_name,
      avatar_url,
      bio,
      is_active,
      created_at,
      updated_at
  `;

  const result = await pool.query(query, [user_id, ...values]);

  return result.rows[0] || null;
};

/* DELETE */
export const deleteUser = async (user_id: string): Promise<boolean> => {
  const result = await pool.query(
    `
    DELETE FROM users
    WHERE user_id = $1
    `,
    [user_id]
  );

  return result.rowCount === 1;
};

/* FOLLOW OPERATIONS */
export const followUser = async (input: FollowUserInput): Promise<boolean> => {
  try {
    const result = await pool.query(
      `
      INSERT INTO user_follows (follower_id, following_id)
      VALUES ($1, $2)
      `,
      [input.follower_id, input.following_id]
    );
    return result.rowCount === 1;
  } catch (error) {
    // If the relationship already exists, return false
    return false;
  }
};

export const unfollowUser = async (input: UnfollowUserInput): Promise<boolean> => {
  const result = await pool.query(
    `
    DELETE FROM user_follows
    WHERE follower_id = $1 AND following_id = $2
    `,
    [input.follower_id, input.following_id]
  );
  return result.rowCount === 1;
};

export const getFollowers = async (user_id: string, limit: number = 20, offset: number = 0): Promise<User[]> => {
  const result = await pool.query(
    `
    SELECT
      u.user_id,
      u.auth_user_id,
      u.username,
      u.display_name,
      u.avatar_url,
      u.bio,
      u.is_active,
      u.created_at,
      u.updated_at
    FROM users u
    JOIN user_follows uf ON u.user_id = uf.follower_id
    WHERE uf.following_id = $1
    ORDER BY uf.created_at DESC
    LIMIT $2 OFFSET $3
    `,
    [user_id, limit, offset]
  );
  return result.rows;
};

export const getFollowing = async (user_id: string, limit: number = 20, offset: number = 0): Promise<User[]> => {
  const result = await pool.query(
    `
    SELECT
      u.user_id,
      u.auth_user_id,
      u.username,
      u.display_name,
      u.avatar_url,
      u.bio,
      u.is_active,
      u.created_at,
      u.updated_at
    FROM users u
    JOIN user_follows uf ON u.user_id = uf.following_id
    WHERE uf.follower_id = $1
    ORDER BY uf.created_at DESC
    LIMIT $2 OFFSET $3
    `,
    [user_id, limit, offset]
  );
  return result.rows;
};

export const checkIfFollowing = async (follower_id: string, following_id: string): Promise<boolean> => {
  const result = await pool.query(
    `
    SELECT 1
    FROM user_follows
    WHERE follower_id = $1 AND following_id = $2
    LIMIT 1
    `,
    [follower_id, following_id]
  );
  return result.rows.length > 0;
};