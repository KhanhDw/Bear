import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "./auth.service.js";
import { RegisterInput, LoginInput } from "./auth.types.js";
import "@fastify/cookie";

/* REGISTER */
export const register = async (
  req: FastifyRequest<{
    Body: RegisterInput;
  }>,
  reply: FastifyReply
) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return reply.status(400).send({ error: "Username, email, and password are required" });
    }

    const user = await AuthService.register({ username, email, password });

    // Don't return sensitive information
    const { password_hash, salt, ...safeUser } = user;

    reply.status(201).send({
      message: "User registered successfully",
      user: safeUser
    });
  } catch (error: any) {
    if (error.message === "User with this email already exists") {
      return reply.status(409).send({ error: error.message });
    }
    reply.status(500).send({ error: "Internal server error" });
  }
};

/* LOGIN */
export const login = async (
  req: FastifyRequest<{
    Body: LoginInput;
  }>,
  reply: FastifyReply
) => {
  try {
    const { email, password } = req.body;

    const result = await AuthService.login({ email, password });

    // Don't return sensitive information
    const { user, tokens } = result;
    const { password_hash, salt, ...safeUser } = user;

    reply.send({
      message: "Login successful",
      user: safeUser,
      tokens
    });
  } catch (error: any) {
    if (error.message === "Invalid email or password") {
      return reply.status(401).send({ error: error.message });
    }
    reply.status(500).send({ error: "Internal server error" });
  }
};

/* LOGOUT */
export const logout = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // Extract refresh token from cookies or header
    const refreshToken = req.headers.authorization?.split(' ')[1] || req.cookies?.refreshToken;

    if (refreshToken) {
      await AuthService.logout(refreshToken);
    }

    reply.send({ message: "Logout successful" });
  } catch (error) {
    reply.status(500).send({ error: "Internal server error" });
  }
};

/* REFRESH TOKEN */
export const refreshToken = async (
  req: FastifyRequest<{
    Body: { refreshToken: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return reply.status(400).send({ error: "Refresh token is required" });
    }

    const tokens = await AuthService.refreshAccessToken(refreshToken);

    reply.send({
      message: "Token refreshed successfully",
      tokens
    });
  } catch (error: any) {
    if (error.message === "Invalid or expired refresh token") {
      return reply.status(401).send({ error: error.message });
    }
    reply.status(500).send({ error: "Internal server error" });
  }
};

/* VERIFY TOKEN */
export const verifyToken = async (
  req: FastifyRequest<{
    Headers: { authorization?: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ error: "Authorization token required" });
    }

    const token = authHeader.substring(7);
    const decoded = await AuthService.verifyAccessToken(token);

    reply.send({
      message: "Token is valid",
      user: { userId: decoded.userId, email: decoded.userEmail }
    });
  } catch (error: any) {
    if (error.message === "Invalid or expired access token") {
      return reply.status(401).send({ error: error.message });
    }
    reply.status(500).send({ error: "Internal server error" });
  }
};
