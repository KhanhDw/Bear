// gateway/src/app.ts
import Fastify from "fastify";
import proxy from "@fastify/http-proxy";
export const buildApp = () => {
    const app = Fastify();
    app.get("/health", async () => ({
        status: "ok",
    }));
    app.register(proxy, {
        upstream: "http://localhost:3000",
        prefix: "/posts",
        rewritePrefix: "",
        http2: false,
    });
    return app;
};
