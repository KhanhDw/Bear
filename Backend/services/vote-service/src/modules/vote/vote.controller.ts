import { FastifyRequest, FastifyReply } from "fastify";
import {
  createVoteService,
  getVotesService,
  getVoteByIdService,
  getVoteByUserAndEntityService,
  getVotesByUserService,
  getVotesByEntityService,
  getVoteCountsByEntityService,
  updateVoteService,
  deleteVoteService,
  deleteVoteByUserAndEntityService,
} from "./vote.service.js";
import { CreateVoteInput, UpdateVoteInput, ListVotesInput } from "./vote.types.js";

/* CREATE/UPDATE VOTE */
export const createOrUpdateVote = async (
  req: FastifyRequest<{ Body: CreateVoteInput }>,
  reply: FastifyReply
) => {
  try {
    const vote = await createVoteService(req.body);
    reply.code(201).send(vote);
  } catch (error: any) {
    reply.code(500).send({ message: error.message });
  }
};

/* READ ALL VOTES */
export const getVotes = async (
  req: FastifyRequest<{ Querystring: ListVotesInput & { limit?: string; offset?: string } }>,
  reply: FastifyReply
) => {
  const { user_id, entity_id, entity_type, vote_type, limit = "20", offset = "0" } = req.query;
  const input: ListVotesInput = {
    user_id,
    entity_id,
    entity_type,
    vote_type,
    limit: parseInt(limit),
    offset: parseInt(offset),
  };

  const votes = await getVotesService(input);
  reply.send(votes);
};

/* READ ONE VOTE */
export const getVoteById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const vote = await getVoteByIdService(req.params.id);

  if (!vote) {
    return reply.code(404).send({ message: "Vote not found" });
  }

  reply.send(vote);
};

/* READ VOTE BY USER AND ENTITY */
export const getVoteByUserAndEntity = async (
  req: FastifyRequest<{ Querystring: { user_id: string; entity_id: string; entity_type: string } }>,
  reply: FastifyReply
) => {
  const { user_id, entity_id, entity_type } = req.query;

  const vote = await getVoteByUserAndEntityService(user_id, entity_id, entity_type);

  if (!vote) {
    return reply.code(404).send({ message: "Vote not found" });
  }

  reply.send(vote);
};

/* READ VOTES BY USER */
export const getVotesByUser = async (
  req: FastifyRequest<{ Querystring: { user_id: string; limit?: string; offset?: string } }>,
  reply: FastifyReply
) => {
  const { user_id, limit = "20", offset = "0" } = req.query;
  const input: ListVotesInput = {
    user_id,
    limit: parseInt(limit),
    offset: parseInt(offset),
  };

  const votes = await getVotesByUserService(user_id);
  reply.send(votes);
};

/* READ VOTES BY ENTITY */
export const getVotesByEntity = async (
  req: FastifyRequest<{ Querystring: { entity_id: string; entity_type: string; limit?: string; offset?: string } }>,
  reply: FastifyReply
) => {
  const { entity_id, entity_type, limit = "20", offset = "0" } = req.query;

  const votes = await getVotesByEntityService(entity_id, entity_type);
  reply.send(votes);
};

/* READ VOTE COUNTS BY ENTITY */
export const getVoteCountsByEntity = async (
  req: FastifyRequest<{ Querystring: { entity_id: string; entity_type: string } }>,
  reply: FastifyReply
) => {
  const { entity_id, entity_type } = req.query;

  const counts = await getVoteCountsByEntityService(entity_id, entity_type);
  reply.send(counts);
};

/* UPDATE VOTE */
export const updateVote = async (
  req: FastifyRequest<{
    Params: { id: string };
    Body: UpdateVoteInput;
  }>,
  reply: FastifyReply
) => {
  const vote = await updateVoteService(req.params.id, req.body);

  if (!vote) {
    return reply.code(404).send({ message: "Vote not found" });
  }

  reply.send(vote);
};

/* DELETE VOTE */
export const deleteVote = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const success = await deleteVoteService(req.params.id);

  if (!success) {
    return reply.code(404).send({ message: "Vote not found" });
  }

  reply.code(204).send();
};

/* DELETE VOTE BY USER AND ENTITY */
export const deleteVoteByUserAndEntity = async (
  req: FastifyRequest<{ Querystring: { user_id: string; entity_id: string; entity_type: string } }>,
  reply: FastifyReply
) => {
  const { user_id, entity_id, entity_type } = req.query;

  const success = await deleteVoteByUserAndEntityService(user_id, entity_id, entity_type);

  if (!success) {
    return reply.code(404).send({ message: "Vote not found" });
  }

  reply.send({ message: "Vote deleted successfully" });
};