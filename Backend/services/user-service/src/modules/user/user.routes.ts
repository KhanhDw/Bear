import { FastifyInstance } from "fastify";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./user.controller.js";
import { createUserSchema, updateUserSchema } from "./user.schema.js";
import { health } from "../../health/health.route.js";

export default async function userRoutes(app: FastifyInstance) {
  app.post("/", { schema: createUserSchema }, createUser);
  app.get("/", getUsers);
  app.get("/:id", getUserById);
  app.put("/:id", { schema: updateUserSchema }, updateUser);
  app.delete("/:id", deleteUser);

  app.get("/health", health);
}