import { FastifyInstance } from "fastify";
import { register, login, logout, refreshToken, verifyToken } from "./auth.controller.js";
import { health } from "../../health/health.route.js";

export default async function authRoutes(app: FastifyInstance) {
  // Registration
  app.post("/register", register);

  // Login
  app.post("/login", login);

  // Logout
  app.post("/logout", logout);

  // Refresh token
  app.post("/refresh", refreshToken);

  // Verify token
  app.get("/verify", verifyToken);

  // Health check
  app.get("/health", health);
}
