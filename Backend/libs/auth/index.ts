import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
  role?: string;
}

class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

  /**
   * Generate JWT token
   */
  static generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, AuthService.JWT_SECRET, {
      expiresIn: AuthService.JWT_EXPIRES_IN,
      issuer: 'social-feed-platform',
    });
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, AuthService.JWT_SECRET) as TokenPayload;
      return decoded;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  /**
   * Refresh token (simplified implementation)
   */
  static refreshToken(oldToken: string): string | null {
    const payload = AuthService.verifyToken(oldToken);
    if (!payload) return null;

    // Create new token with same payload
    return AuthService.generateToken(payload);
  }

  /**
   * Extract token from Authorization header
   */
  static extractToken(authorizationHeader?: string): string | null {
    if (!authorizationHeader) return null;

    const parts = authorizationHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }

    return null;
  }
}

export default AuthService;