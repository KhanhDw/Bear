import { pool } from "../../db/db.js";
import { User, RefreshToken, ApiKey } from "./auth.types.js";
import { v4 as uuidv4 } from "uuid";

export class AuthRepository {
  // User operations
  static async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND is_active = true",
      [email]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async findById(userId: string): Promise<User | null> {
    const result = await pool.query(
      "SELECT * FROM users WHERE user_id = $1 AND is_active = true",
      [userId]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async createUser(userData: Omit<User, 'user_id' | 'created_at' | 'updated_at'>): Promise<User> {
    const userId = `user-${uuidv4().substring(0, 8)}`;
    const createdAt = new Date().toISOString();
    
    const result = await pool.query(
      `INSERT INTO users (user_id, username, email, password_hash, salt, is_active, is_verified, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        userId,
        userData.username,
        userData.email,
        userData.password_hash,
        userData.salt,
        userData.is_active,
        userData.is_verified,
        createdAt,
        createdAt
      ]
    );
    return result.rows[0];
  }

  static async updateUserLastLogin(userId: string): Promise<void> {
    await pool.query(
      "UPDATE users SET last_login_at = $1, updated_at = $2 WHERE user_id = $3",
      [new Date().toISOString(), new Date().toISOString(), userId]
    );
  }

  // Refresh token operations
  static async createRefreshToken(tokenData: Omit<RefreshToken, 'token_id' | 'created_at'>): Promise<RefreshToken> {
    const tokenId = `rt-${uuidv4().substring(0, 8)}`;
    const createdAt = new Date().toISOString();
    
    const result = await pool.query(
      `INSERT INTO refresh_tokens (token_id, user_id, token, expires_at, is_revoked, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        tokenId,
        tokenData.user_id,
        tokenData.token,
        tokenData.expires_at,
        tokenData.is_revoked,
        createdAt
      ]
    );
    return result.rows[0];
  }

  static async findValidRefreshToken(token: string): Promise<RefreshToken | null> {
    const result = await pool.query(
      "SELECT * FROM refresh_tokens WHERE token = $1 AND is_revoked = false AND expires_at > NOW()",
      [token]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  static async revokeRefreshToken(tokenId: string): Promise<void> {
    await pool.query(
      "UPDATE refresh_tokens SET is_revoked = true WHERE token_id = $1",
      [tokenId]
    );
  }

  // API key operations
  static async findApiKey(apiKey: string): Promise<ApiKey | null> {
    const result = await pool.query(
      "SELECT * FROM api_keys WHERE api_key = $1 AND is_active = true AND (expires_at IS NULL OR expires_at > NOW())",
      [apiKey]
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  }
}