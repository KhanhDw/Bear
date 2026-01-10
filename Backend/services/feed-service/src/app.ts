import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import feedRoutes from "./modules/feed/feed.routes.js";

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
    console.log(`[FEED-SERVICE] ${req.method} ${req.url}`);
  });

  app.register(feedRoutes); // no need using perfix because gateway app was used perfix

  return app;
};