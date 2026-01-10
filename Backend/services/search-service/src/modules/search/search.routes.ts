import { FastifyInstance } from "fastify";
import {
  search,
} from "./search.controller.js";
import { health } from "../../health/health.route.js";

export default async function searchRoutes(app: FastifyInstance) {
  app.get("/", search);

  app.get("/health", health);
}