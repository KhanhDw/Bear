import { pool } from "../../db/db";
import { User } from "./auth.types";

export interface EmailVerificationToken {
  token_id: string;
  user_id: string;
  token_hash: string;
  expires_at: string;
  is_used: boolean;
  created_at: string;
}

export class EmailVerificationRepository {
  static async createVerificationToken(userId: string, tokenHash: string, expiresAt: string): Promise<EmailVerificationToken> {
    const result = await pool.query(
      `INSERT INTO email_verification_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, tokenHash, expiresAt]
    );
    
    return result.rows[0];
  }

  static async findValidTokenByHash(tokenHash: string): Promise<EmailVerificationToken | null> {
    const result = await pool.query(
      `SELECT * FROM email_verification_tokens 
       WHERE token_hash = $1 
         AND expires_at > NOW() 
         AND is_used = FALSE
       LIMIT 1`,
      [tokenHash]
    );
    
    return result.rows[0] || null;
  }

  static async markTokenAsUsed(tokenId: string): Promise<void> {
    await pool.query(
      `UPDATE email_verification_tokens 
       SET is_used = TRUE, 
           expires_at = NOW()  -- Expire immediately after use
       WHERE token_id = $1`,
      [tokenId]
    );
  }

  static async cleanupExpiredTokens(): Promise<number> {
    const result = await pool.query(
      `DELETE FROM email_verification_tokens 
       WHERE expires_at <= NOW() OR is_used = TRUE`
    );
    
    return result.rowCount || 0;
  }

  static async findUserById(userId: string): Promise<User | null> {
    const result = await pool.query(
      `SELECT * FROM users WHERE user_id = $1 LIMIT 1`,
      [userId]
    );
    
    return result.rows[0] || null;
  }

  static async updateUserVerificationStatus(userId: string, isVerified: boolean): Promise<User> {
    const result = await pool.query(
      `UPDATE users 
       SET is_verified = $1, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $2
       RETURNING *`,
      [isVerified, userId]
    );
    
    return result.rows[0];
  }
}