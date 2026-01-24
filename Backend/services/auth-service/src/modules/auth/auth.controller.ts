import "@fastify/cookie";
import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "./auth.service";
import { LoginInput, RegisterInput } from "./auth.types";

/* =======================
 * REGISTER
 * ======================= */
export const register = async (
  req: FastifyRequest<{ Body: RegisterInput }>,
  reply: FastifyReply
) => {
  try {
    const user = await AuthService.register(req.body);

    const { password_hash, ...safeUser } = user;

    reply.code(201).send({
      message: "User registered successfully",
      user: safeUser,
    });
  } catch (err: any) {
    if (err.message === "User with this email already exists") {
      return reply.code(409).send({ error: err.message });
    }
    reply.code(500).send({ error: "Internal server error" });
  }
};

/* =======================
 * LOGIN
 * ======================= */
export const login = async (
  req: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) => {
  try {
    const { user, tokens } = await AuthService.login(req.body);

    const { password_hash, ...safeUser } = user;

    reply.send({
      message: "Login successful",
      user: safeUser,
      tokens,
    });
  } catch (err: any) {
    if (
      err.message === "Invalid email or password" ||
      err.message === "Email not verified"
    ) {
      return reply.code(401).send({ error: err.message });
    }
    reply.code(500).send({ error: "Internal server error" });
  }
};

/* =======================
 * LOGOUT
 * ======================= */
export const logout = async (
  req: FastifyRequest<{ Body?: { refresh_token?: string } }>,
  reply: FastifyReply
) => {
  try {
    const refreshToken =
      req.body?.refresh_token || req.cookies?.refresh_token;

    if (refreshToken) {
      await AuthService.logout(refreshToken);
    }

    reply.send({ message: "Logout successful" });
  } catch {
    reply.code(500).send({ error: "Internal server error" });
  }
};

/* =======================
 * REFRESH TOKEN
 * ======================= */
export const refreshToken = async (
  req: FastifyRequest<{ Body: { refresh_token: string } }>,
  reply: FastifyReply
) => {
  try {
    const { refresh_token } = req.body;

    const tokens = await AuthService.refreshAccessToken(refresh_token);

    reply.send({
      message: "Token refreshed successfully",
      tokens,
    });
  } catch (err: any) {
    if (err.message === "Invalid or expired refresh token") {
      return reply.code(401).send({ error: err.message });
    }
    reply.code(500).send({ error: "Internal server error" });
  }
};

/* =======================
 * VERIFY ACCESS TOKEN
 * ======================= */
export const verifyToken = async (
  req: FastifyRequest<{ Headers: { authorization?: string } }>,
  reply: FastifyReply
) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      return reply.code(401).send({ error: "Authorization token required" });
    }

    const token = auth.slice(7);
    const payload = AuthService.verifyAccessToken(token);

    reply.send({
      message: "Token is valid",
      user: {
        user_id: payload.userId,
        email: payload.userEmail,
      },
    });
  } catch {
    reply.code(401).send({ error: "Invalid or expired access token" });
  }
};
