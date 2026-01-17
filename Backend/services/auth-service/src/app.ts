import Fastify from "fastify";
import authRoutes from "./modules/auth/auth.routes.js";

export const buildApp = () => {
  const app = Fastify({
    logger: {
      transport: {
        target: "pino-pretty",
      },
    },
  });

  app.addHook("onRequest", async (req) => {
    console.log(`[AUTH-SERVICE] ${req.method} ${req.url}`);
  });

  // Register auth routes
  app.register(authRoutes);

  return app;
};