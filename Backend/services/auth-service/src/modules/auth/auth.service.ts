import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, LoginInput, RegisterInput, TokenPair } from "./auth.types.js";
import { AuthRepository } from "./auth.repository.js";
import redis from "redis";

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
});

await redisClient.connect();

export class AuthService {
  private static readonly ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev";
  private static readonly ACCESS_TOKEN_EXPIRY = process.env.JWT_EXPIRES_IN || "15m";
  private static readonly REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

  static async register(userData: RegisterInput): Promise<User> {
    // Check if user already exists
    const existingUser = await AuthRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create user
    const newUser = await AuthRepository.createUser({
      username: userData.username,
      email: userData.email,
      password_hash: hashedPassword,
      salt: salt,
      is_active: true,
      is_verified: false
    });

    return newUser;
  }

  static async login(credentials: LoginInput): Promise<{ user: User, tokens: TokenPair }> {
    // Find user by email
    const user = await AuthRepository.findByEmail(credentials.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(credentials.password, user.password_hash);
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.user_id, user.email);

    // Update last login
    await AuthRepository.updateUserLastLogin(user.user_id);

    return { user, tokens };
  }

  static async logout(refreshToken: string): Promise<void> {
    // Find the refresh token
    const tokenRecord = await AuthRepository.findValidRefreshToken(refreshToken);
    if (tokenRecord) {
      // Revoke the refresh token
      await AuthRepository.revokeRefreshToken(tokenRecord.token_id);
    }
  }

  static async refreshAccessToken(refreshToken: string): Promise<TokenPair> {
    // Find the refresh token
    const tokenRecord = await AuthRepository.findValidRefreshToken(refreshToken);
    if (!tokenRecord) {
      throw new Error("Invalid or expired refresh token");
    }

    // Get user info
    const user = await AuthRepository.findById(tokenRecord.user_id);
    if (!user) {
      throw new Error("User not found");
    }

    // Generate new tokens
    const newTokens = await this.generateTokens(user.user_id, user.email);

    // Revoke old refresh token
    await AuthRepository.revokeRefreshToken(tokenRecord.token_id);

    return newTokens;
  }

  private static async generateTokens(userId: string, userEmail: string): Promise<TokenPair> {
    // Generate access token
    const accessToken = jwt.sign(
      { userId, userEmail },
      this.ACCESS_TOKEN_SECRET,
      { expiresIn: this.ACCESS_TOKEN_EXPIRY }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId },
      this.ACCESS_TOKEN_SECRET,
      { expiresIn: this.REFRESH_TOKEN_EXPIRY }
    );

    // Store refresh token in database
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // 7 days from now

    await AuthRepository.createRefreshToken({
      user_id: userId,
      token: refreshToken,
      expires_at: expiryDate.toISOString(),
      is_revoked: false
    });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  static async verifyAccessToken(token: string): Promise<any> {
    try {
      return jwt.verify(token, this.ACCESS_TOKEN_SECRET);
    } catch (error) {
      throw new Error("Invalid or expired access token");
    }
  }

  static async validateApiKey(apiKey: string): Promise<boolean> {
    const key = await AuthRepository.findApiKey(apiKey);
    return !!key;
  }
}