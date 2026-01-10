import { FastifyInstance } from "fastify";
import {
  createOrUpdateVote,
  getVotes,
  getVoteById,
  getVoteByUserAndEntity,
  getVotesByUser,
  getVotesByEntity,
  getVoteCountsByEntity,
  updateVote,
  deleteVote,
  deleteVoteByUserAndEntity,
} from "./vote.controller.js";
import { health } from "../../health/health.route.js";

export default async function voteRoutes(app: FastifyInstance) {
  app.post("/", createOrUpdateVote);
  app.get("/", getVotes);
  app.get("/by-user-entity", getVoteByUserAndEntity);
  app.get("/by-user", getVotesByUser);
  app.get("/by-entity", getVotesByEntity);
  app.get("/counts", getVoteCountsByEntity);
  app.get("/:id", getVoteById);
  app.put("/:id", updateVote);
  app.delete("/:id", deleteVote);
  app.delete("/by-user-entity", deleteVoteByUserAndEntity);

  app.get("/health", health);
}