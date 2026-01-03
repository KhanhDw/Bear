// gateway/src/app.ts
import Fastify from "fastify";
import proxy from "@fastify/http-proxy";

export const buildApp = () => {
  const app = Fastify();

  app.get("/health", async () => ({
    status: "ok",
  }));

  app.addHook("onResponse", async (req, reply) => {
    req.log.info(
      {
        method: req.method,
        url: req.url,
        statusCode: reply.statusCode,
      },
      "Response sent"
    );
  });

  app.register(proxy, {
    // upstream: "http://post-service:3000", // cho docker
    upstream: "http://localhost:3001", // cho local
    prefix: "/posts",
    rewritePrefix: "",
    http2: false,
  });

  // app.register(proxy, {
  //   upstream: "http://feed-service:3000",
  //   prefix: "/feed",
  // });

  return app;
};
