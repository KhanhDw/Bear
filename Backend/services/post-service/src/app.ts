import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import postRoutes from "./modules/post/post.routes.js";

export const buildApp = () => {
  const app = Fastify({
    logger: {
      transport: {
        target: "pino-pretty",
      },
    },
  });

  // Swagger spec (OpenAPI 3)
  app.register(swagger);

  // Swagger UI
  app.register(swaggerUI, {
    routePrefix: "/docs",
  });

  app.addHook("onRequest", async (req) => {
    console.log(`[POST-SERVICE] ${req.method} ${req.url}`);
  });

  // app.register(postRoutes, { prefix: "/posts" });
  app.register(postRoutes); // no need using perfix because gateway app was used perfix

  return app;
};
