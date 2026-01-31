import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt, { JwtPayload as JwtBasePayload } from "jsonwebtoken";
import { pool } from "../../db/db";
import { AuthRepository } from "./auth.repository";
import { LoginInput, RegisterInput, TokenPair, User } from "./auth.types";
import { EmailService } from "./email.service";
import { EmailVerificationRepository } from "./email.verification.repository";

/* =======================
 * ACCESS TOKEN PAYLOAD
 * ======================= */
export interface AccessTokenPayload extends JwtBasePayload {
  userId: string;
  userEmail: string;
  scopes: string[];
}

export interface DecodedAccessTokenPayload extends AccessTokenPayload {
  iat: number;
  exp: number;
}

/* =======================
 * AUTH SERVICE
 * ======================= */
export class AuthService {
  private static readonly ACCESS_TOKEN_SECRET =
    process.env.JWT_ACCESS_SECRET ?? "dev_access_secret";

  private static readonly ACCESS_TOKEN_EXPIRES_IN =
    (process.env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"]) ??
    "15m";

  private static readonly REFRESH_TOKEN_DAYS = Number(
    process.env.REFRESH_TOKEN_DAYS ?? 7,
  );

  /* =======================
   * REGISTER
   * ======================= */
  static async register(input: RegisterInput): Promise<User> {
    const exists = await AuthRepository.findByEmail(input.email);
    if (exists) {
      throw new Error("User with this email already exists");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await AuthRepository.createUser({
      email: input.email,
      password_hash: passwordHash,
      is_active: true,
      is_verified: false,
    });

    // Outbox event (event-driven ready)
    await pool.query(
      `INSERT INTO outbox_events (aggregate_type, aggregate_id, event_type, payload)
       VALUES ('USER', $1, 'USER_CREATED', $2)`,
      [user.user_id, JSON.stringify({ email: user.email })],
    );

    return user;
  }

  /* =======================
   * LOGIN
   * ======================= */
  static async login(
    input: LoginInput,
  ): Promise<{ user: User; tokens: TokenPair }> {
    const user = await AuthRepository.findByEmail(input.email);
    if (!user || !user.is_active) {
      throw new Error("Invalid email or password");
    }

    const valid = await bcrypt.compare(input.password, user.password_hash);
    if (!valid) {
      throw new Error("Invalid email or password");
    }

    if (!user.is_verified) {
      throw new Error("Email not verified");
    }

    const tokens = await this.issueTokenPair(user.user_id, user.email);

    await AuthRepository.updateUserLastLogin(user.user_id);

    return { user, tokens };
  }

  /* =======================
   * LOGOUT
   * ======================= */
  static async logout(refreshToken: string): Promise<void> {
    const token = await AuthRepository.findValidRefreshToken(refreshToken);
    if (token) {
      await AuthRepository.revokeRefreshToken(token.token_id);
    }
  }

  /* =======================
   * REFRESH TOKEN (ROTATE)
   * ======================= */
  static async refreshAccessToken(refreshToken: string): Promise<TokenPair> {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const tokenRecord =
        await AuthRepository.findValidRefreshToken(refreshToken);

      if (!tokenRecord) {
        throw new Error("Invalid or expired refresh token");
      }

      const user = await AuthRepository.findById(tokenRecord.user_id);
      if (!user || !user.is_active) {
        throw new Error("User not found");
      }

      // revoke old refresh token
      await AuthRepository.revokeRefreshToken(tokenRecord.token_id);

      // issue new pair
      const tokens = await this.issueTokenPair(user.user_id, user.email);

      await client.query("COMMIT");
      return tokens;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  /* =======================
   * ISSUE TOKEN PAIR
   * ======================= */
  private static async issueTokenPair(
    userId: string,
    email: string,
  ): Promise<TokenPair> {
    const payload: AccessTokenPayload = {
      userId,
      userEmail: email,
      scopes: [],
    };  

    const accessToken = jwt.sign(payload, this.ACCESS_TOKEN_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = crypto.randomBytes(64).toString("hex");

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.REFRESH_TOKEN_DAYS);

    await AuthRepository.createRefreshToken({
      user_id: userId,
      token: refreshToken,
      expires_at: expiresAt.toISOString(),
      is_revoked: false,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  /* =======================
   * VERIFY ACCESS TOKEN
   * ======================= */
  static verifyAccessToken(token: string): DecodedAccessTokenPayload {
    try {
      return jwt.verify(
        token,
        this.ACCESS_TOKEN_SECRET,
      ) as DecodedAccessTokenPayload;
    } catch {
      throw new Error("Invalid or expired access token");
    }
  }

  /* =======================
   * API KEY
   * ======================= */
  static async validateApiKey(apiKey: string): Promise<boolean> {
    const key = await AuthRepository.findApiKey(apiKey);
    return Boolean(key);
  }

  /* =======================
   * SEND VERIFICATION EMAIL
   * ======================= */
  static async sendVerificationEmail(email: string): Promise<boolean> {
    const user = await AuthRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.is_verified) {
      throw new Error("Email already verified");
    }

    // Generate a unique token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // Set expiration time (24 hours)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Store the token in the database
    await EmailVerificationRepository.createVerificationToken(
      user.user_id,
      tokenHash,
      expiresAt.toISOString(),
    );

    // Send the verification email
    const emailSent = await EmailService.sendVerificationEmail({
      to: user.email,
      token: verificationToken,
      username: user.email.split("@")[0], // Use part of email as username
    });

    return emailSent;
  }

  /* =======================
   * VERIFY EMAIL
   * ======================= */
  static async verifyEmail(token: string): Promise<User> {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Find the token record
    const tokenRecord =
      await EmailVerificationRepository.findValidTokenByHash(tokenHash);
    if (!tokenRecord) {
      throw new Error("Invalid or expired verification token");
    }

    // Mark the token as used
    await EmailVerificationRepository.markTokenAsUsed(tokenRecord.token_id);

    // Update user's verification status
    const user = await EmailVerificationRepository.updateUserVerificationStatus(
      tokenRecord.user_id,
      true,
    );

    return user;
  }
}
