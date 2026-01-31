import { FastifyInstance } from "fastify";
import { FastifyRequest, FastifyReply } from "fastify";
import { health } from "../../health/health.route.js";
import { authenticate } from "./auth.middleware.js";
import {
  checkIfFollowing as checkIfFollowingController,
  createUser as createUserController,
  deleteUser as deleteUserController,
  followUser as followUserController,
  getFollowers as getFollowersController,
  getFollowing as getFollowingController,
  getUserByAuthId as getUserByAuthIdController,
  getUserById as getUserByIdController,
  getUsers as getUsersController,
  unfollowUser as unfollowUserController,
  updateUser as updateUserController,
} from "./user.controller.js";
import { createUserSchema, followUserSchema, updateUserSchema } from "./user.schema.js";

export default async function userRoutes(app: FastifyInstance) {
  // Public routes
  app.get("/health", health);
  app.get("/:id", getUserByIdController);
  app.get("/auth/:authId", getUserByAuthIdController); // Get user by auth service ID
  app.get("/:id/followers", getFollowersController);
  app.get("/:id/following", getFollowingController);

  // Protected routes (require authentication)
  app.post("/", { preHandler: authenticate, schema: createUserSchema }, (req, reply) => createUserController(req as any, reply));
  app.get("/", { preHandler: authenticate }, (req, reply) => getUsersController(req as any, reply));
  app.put("/:id", { preHandler: authenticate, schema: updateUserSchema }, (req, reply) => updateUserController(req as any, reply));
  app.delete("/:id", { preHandler: authenticate }, (req, reply) => deleteUserController(req as any, reply));

  // Follow/unfollow operations (require authentication)
  app.post("/follow", { preHandler: authenticate, schema: followUserSchema }, (req, reply) => followUserController(req as any, reply));
  app.post("/unfollow", { preHandler: authenticate, schema: followUserSchema }, (req, reply) => unfollowUserController(req as any, reply));
  app.get("/following/check", { preHandler: authenticate }, (req, reply) => checkIfFollowingController(req as any, reply));
}