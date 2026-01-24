import { FastifyInstance } from "fastify";
import {
  login,
  logout,
  refreshToken,
  register,
  verifyToken,
} from "./auth.controller";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "./auth.schema";

export async function authRoutes(app: FastifyInstance) {
  /* =======================
   * PUBLIC
   * ======================= */

  app.post("/register", { schema: registerSchema }, register);

  app.post("/login", { schema: loginSchema }, login);

  app.post("/refresh", { schema: refreshTokenSchema }, refreshToken);

  /* =======================
   * PROTECTED
   * ======================= */

  app.post("/logout", logout);

  app.get("/verify", verifyToken);
}
