import jwt, { SignOptions } from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  email: string;
  role?: string;
}

class AuthService {
  private static readonly JWT_SECRET =
    process.env.JWT_SECRET || "supersecretkey";
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

  /**
   * Generate JWT token
   */
  static generateToken(payload: TokenPayload): string {
    const options: SignOptions = {
      expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
      issuer: "social-feed-platform",
    };

    return jwt.sign(payload, AuthService.JWT_SECRET, options);
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, AuthService.JWT_SECRET, {
        issuer: "social-feed-platform",
      }) as jwt.JwtPayload;

      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    } catch {
      return null;
    }
  }

  /**
   * Refresh token (simplified implementation)
   */
  static refreshToken(oldToken: string): string | null {
    const decoded = jwt.verify(oldToken, AuthService.JWT_SECRET) as any;

    const cleanPayload: TokenPayload = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    return AuthService.generateToken(cleanPayload);
  }

  /**
   * Extract token from Authorization header
   */
  static extractToken(authorizationHeader?: string): string | null {
    if (!authorizationHeader) return null;

    const parts = authorizationHeader.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      return parts[1];
    }

    return null;
  }
}

export default AuthService;
