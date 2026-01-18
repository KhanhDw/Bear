import jwt from 'jsonwebtoken';
import { randomBytes, createHash } from 'crypto';
import { RedisManager } from '../../redis/src/redis.manager.js';

export interface TokenPayload {
  userId: string;
  email: string;
  scopes: string[];
  iat: number;
  exp: number;
}

export class TokenManager {
  constructor(
    private accessTokenSecret: string,
    private refreshTokenSecret: string,
    private redisManager: RedisManager,
    private accessTokenExpiry: string = '15m',
    private refreshTokenExpiry: string = '7d'
  ) {}

  generateAccessToken(payload: Omit<TokenPayload, 'exp' | 'iat'>): string {
    return jwt.sign(
      { 
        ...payload,
        scopes: payload.scopes || []
      },
      this.accessTokenSecret,
      { expiresIn: this.accessTokenExpiry }
    );
  }

  async generateRefreshToken(payload: Omit<TokenPayload, 'exp' | 'iat'>): Promise<string> {
    const refreshToken = randomBytes(64).toString('hex');
    const hashedToken = createHash('sha256').update(refreshToken).digest('hex');
    
    // Store hashed refresh token in Redis with user ID
    await this.redisManager.set(hashedToken, payload.userId, { 
      prefix: 'refresh_token', 
      ttl: 7 * 24 * 60 * 60 // 7 days
    });
    
    return refreshToken;
  }

  verifyAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.accessTokenSecret) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  async verifyRefreshToken(token: string, userId: string): Promise<boolean> {
    const hashedToken = createHash('sha256').update(token).digest('hex');
    
    // Check if hashed token exists in Redis for user
    const storedUserId = await this.redisManager.get(hashedToken, { prefix: 'refresh_token' });
    
    return storedUserId === userId;
  }

  async revokeRefreshToken(token: string): Promise<boolean> {
    const hashedToken = createHash('sha256').update(token).digest('hex');
    
    // Remove token from Redis
    return await this.redisManager.del(hashedToken, { prefix: 'refresh_token' });
  }

  async rotateTokens(oldRefreshToken: string, userId: string): Promise<{ accessToken: string; refreshToken: string } | null> {
    // Verify old refresh token
    if (!await this.verifyRefreshToken(oldRefreshToken, userId)) {
      return null;
    }

    // Generate new tokens
    const newPayload = { userId, scopes: [] }; // Get scopes from user record
    const newAccessToken = this.generateAccessToken(newPayload);
    const newRefreshToken = await this.generateRefreshToken(newPayload);

    // Revoke old refresh token
    await this.revokeRefreshToken(oldRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    // Invalidate all refresh tokens for user
    const pattern = `refresh_token:*`;
    const keys = await this.redisManager.invalidatePattern(pattern);
    
    // Also invalidate user sessions
    await this.redisManager.invalidatePattern(`session:user_${userId}*`);
  }
}