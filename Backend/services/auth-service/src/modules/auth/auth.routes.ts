import { FastifyInstance } from "fastify";
import {
  login,
  logout,
  refreshToken,
  register,
  verifyToken,
  requestEmailVerification,
  verifyEmail,
} from "./auth.controller";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  requestVerificationSchema,
  verifyEmailSchema,
} from "./auth.schema";

export async function authRoutes(app: FastifyInstance) {
  /* =======================
   * PUBLIC
   * ======================= */

  app.post("/register", { schema: registerSchema }, register);

  app.post("/login", { schema: loginSchema }, login);

  app.post("/refresh", { schema: refreshTokenSchema }, refreshToken);

  app.post("/request-verification", { schema: requestVerificationSchema }, requestEmailVerification);

  app.get("/verify-email", { schema: verifyEmailSchema }, verifyEmail);

  /* =======================
   * PROTECTED
   * ======================= */

  app.post("/logout", logout);

  app.get("/verify", verifyToken);
}
