import { FastifyInstance } from "fastify";
import {
  getUserFeed,
  addToFeed,
  removeFromFeed,
} from "./feed.controller.js";
import { health } from "../../health/health.route.js";

export default async function feedRoutes(app: FastifyInstance) {
  app.get("/", getUserFeed);
  app.post("/add", addToFeed);
  app.post("/remove", removeFromFeed);

  app.get("/health", health);
}