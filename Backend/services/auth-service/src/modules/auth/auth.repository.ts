import crypto from "crypto";
import { pool } from "../../db/db";
import { ApiKey, RefreshToken, User } from "./auth.types";

/* =========================
 * HELPERS
 * ========================= */
function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export class AuthRepository {
  /* =========================
   * USERS
   * ========================= */
  static async findByEmail(email: string): Promise<User | null> {
    const { rows } = await pool.query(
      `SELECT *
       FROM users
       WHERE email = $1
         AND is_active = true`,
      [email]
    );
    return rows[0] ?? null;
  }

  static async findById(userId: string): Promise<User | null> {
    const { rows } = await pool.query(
      `SELECT *
       FROM users
       WHERE user_id = $1
         AND is_active = true`,
      [userId]
    );
    return rows[0] ?? null;
  }

  static async createUser(
    data: Omit<
      User,
      "user_id" | "created_at" | "updated_at" | "last_login_at"
    >
  ): Promise<User> {
    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash, is_active, is_verified)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.email, data.password_hash, data.is_active, data.is_verified]
    );
    return rows[0];
  }

  static async updateUserLastLogin(userId: string): Promise<void> {
    await pool.query(
      `UPDATE users
       SET last_login_at = CURRENT_TIMESTAMP
       WHERE user_id = $1`,
      [userId]
    );
  }

  /* =========================
   * REFRESH TOKENS
   * ========================= */
  static async createRefreshToken(data: {
    user_id: string;
    token: string;
    expires_at: string;
    is_revoked: boolean;
  }): Promise<RefreshToken> {
    const tokenHash = sha256(data.token);

    const { rows } = await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at, is_revoked)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.user_id, tokenHash, data.expires_at, data.is_revoked]
    );

    return rows[0];
  }

  static async findValidRefreshToken(
    token: string
  ): Promise<RefreshToken | null> {
    const tokenHash = sha256(token);

    const { rows } = await pool.query(
      `SELECT *
       FROM refresh_tokens
       WHERE token_hash = $1
         AND is_revoked = false
         AND expires_at > NOW()`,
      [tokenHash]
    );

    return rows[0] ?? null;
  }

  static async revokeRefreshToken(tokenId: string): Promise<void> {
    await pool.query(
      `UPDATE refresh_tokens
       SET is_revoked = true
       WHERE token_id = $1`,
      [tokenId]
    );
  }

  /* =========================
   * API KEYS
   * ========================= */
  static async findApiKey(rawApiKey: string): Promise<ApiKey | null> {
    const apiKeyHash = sha256(rawApiKey);

    const { rows } = await pool.query(
      `SELECT *
       FROM api_keys
       WHERE api_key_hash = $1
         AND is_active = true
         AND (expires_at IS NULL OR expires_at > NOW())`,
      [apiKeyHash]
    );

    return rows[0] ?? null;
  }
}
