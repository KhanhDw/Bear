import Fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import voteRoutes from "./modules/vote/vote.routes.js";

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
    console.log(`[VOTE-SERVICE] ${req.method} ${req.url}`);
  });

  app.register(voteRoutes); // no need using perfix because gateway app was used perfix

  return app;
};