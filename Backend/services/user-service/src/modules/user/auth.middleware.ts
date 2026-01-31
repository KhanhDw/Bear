import { FastifyReply, FastifyRequest } from 'fastify';
import { AuthClient } from './auth.client.js';

const authClient = new AuthClient();

export interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    user_id: string;
    email: string;
  };
}

/**
 * Middleware to authenticate requests using local JWT validation
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: FastifyReply
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).send({ error: 'Authorization token required' });
    return;
  }

  const token = authHeader.substring(7);

  try {
    const userData = await authClient.verifyToken(token);

    if (!userData) {
      res.status(401).send({ error: 'Invalid or expired token' });
      return;
    }

    // Attach user data to request object
    req.user = {
      user_id: userData.user_id,
      email: userData.email
    };
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).send({ error: 'Authentication failed' });
  }
};