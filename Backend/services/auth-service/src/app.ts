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

  app.register(require('@fastify/cookie'), {
    secret: "my-secret", // Tùy chọn: dùng để ký (sign) cookie
    parseOptions: {}     // Tùy chọn: cấu hình mặc định khi parse
  })


  app.addHook("onRequest", async (req) => {
    console.log(`[AUTH-SERVICE] ${req.method} ${req.url}`);
  });

  // Register auth routes
  app.register(authRoutes);

  return app;
};
