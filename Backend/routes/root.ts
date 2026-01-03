// src/routes/root.ts
import { FastifyInstance } from "fastify";

export default async function (app: FastifyInstance) {
  app.get("/", async () => {
    return { hello: "autoload heêk" };
  });
}
