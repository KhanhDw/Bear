import { CreateUserInput, UpdateUserInput, User } from "./user.types.js";
import { randomUUID } from "crypto";
import { pool } from "../../db/db.js";
import bcrypt from "bcrypt";

/* CREATE */
export const insertUser = async (input: CreateUserInput): Promise<User> => {
  const hashedPassword = await bcrypt.hash(input.password, 10);
  const result = await pool.query(
    `
    INSERT INTO users (
      user_id,
      username,
      email,
      password_hash,
      user_created_at,
      user_updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $5)
    RETURNING 
      user_id,
      username,
      email,
      user_created_at,
      user_updated_at
    `,
    [
      randomUUID(),
      input.username,
      input.email,
      hashedPassword,
      new Date()
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
      username,
      email,
      user_created_at,
      user_updated_at
    FROM users
    ORDER BY user_created_at DESC
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
      username,
      email,
      user_created_at,
      user_updated_at
    FROM users
    WHERE user_id = $1
    `,
    [user_id]
  );

  return result.rows[0] || null;
};

/* READ - by email */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query(
    `
    SELECT 
      user_id,
      username,
      email,
      password_hash,
      user_created_at,
      user_updated_at
    FROM users
    WHERE email = $1
    `,
    [email]
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
  if (input.email) {
    updates.push(`email = $${paramIndex}`);
    values.push(input.email);
    paramIndex++;
  }
  if (input.password) {
    const hashedPassword = await bcrypt.hash(input.password, 10);
    updates.push(`password_hash = $${paramIndex}`);
    values.push(hashedPassword);
    paramIndex++;
  }

  // Always update the updated_at timestamp
  updates.push(`user_updated_at = $${paramIndex}`);
  values.push(new Date());

  if (updates.length === 0) {
    // If no fields to update, just update the timestamp
    const result = await pool.query(
      `
      UPDATE users
      SET user_updated_at = $2
      WHERE user_id = $1
      RETURNING 
        user_id,
        username,
        email,
        user_created_at,
        user_updated_at
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
      username,
      email,
      user_created_at,
      user_updated_at
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