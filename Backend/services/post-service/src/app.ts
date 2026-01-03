import Fastify from "fastify";
import postRoutes from "../modules/post/post.routes.js";

export const buildApp = () => {
  const app = Fastify({
    logger: {
      transport: {
        target: "pino-pretty",
      },
    },
  });

  app.addHook("onRequest", async (req) => {
    console.log(`[POST-SERVICE] ${req.method} ${req.url}`);
  });

  // app.register(postRoutes, { prefix: "/posts" });
  app.register(postRoutes); // no need using perfix because gateway app was used perfix

  return app;
};
