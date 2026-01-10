import { CreateVoteInput, UpdateVoteInput, Vote, ListVotesInput, VoteCount } from "./vote.types.js";
import {
  insertVote,
  getAllVotes,
  getVoteById,
  getVoteByUserAndEntity,
  getVotesByUser,
  getVotesByEntity,
  getVotes,
  getVoteCountsByEntity,
  getVoteCountsByUser,
  updateVote,
  deleteVote,
  deleteVoteByUserAndEntity,
} from "./vote.repository.js";

/* =======================
   CREATE
   ======================= */
export const createVoteService = async (
  input: CreateVoteInput
): Promise<Vote> => {
  return insertVote(input);
};

/* =======================
   READ – LIST
   ======================= */
export const getVotesService = async (
  input: ListVotesInput
): Promise<Vote[]> => {
  return getVotes(input);
};

/* =======================
   READ – GET ONE
   ======================= */
export const getVoteByIdService = async (
  vote_id: string
): Promise<Vote | null> => {
  return getVoteById(vote_id);
};

/* =======================
   READ – GET BY USER AND ENTITY
   ======================= */
export const getVoteByUserAndEntityService = async (
  user_id: string,
  entity_id: string,
  entity_type: string
): Promise<Vote | null> => {
  return getVoteByUserAndEntity(user_id, entity_id, entity_type);
};

/* =======================
   READ – GET BY USER
   ======================= */
export const getVotesByUserService = async (
  user_id: string
): Promise<Vote[]> => {
  return getVotesByUser(user_id);
};

/* =======================
   READ – GET BY ENTITY
   ======================= */
export const getVotesByEntityService = async (
  entity_id: string,
  entity_type: string
): Promise<Vote[]> => {
  return getVotesByEntity(entity_id, entity_type);
};

/* =======================
   READ – GET VOTE COUNTS BY ENTITY
   ======================= */
export const getVoteCountsByEntityService = async (
  entity_id: string,
  entity_type: string
): Promise<VoteCount> => {
  return getVoteCountsByEntity(entity_id, entity_type);
};

/* =======================
   READ – GET VOTE COUNTS BY USER
   ======================= */
export const getVoteCountsByUserService = async (
  user_id: string
): Promise<{ total_votes: number, upvotes: number, downvotes: number }> => {
  return getVoteCountsByUser(user_id);
};

/* =======================
   UPDATE
   ======================= */
export const updateVoteService = async (
  vote_id: string,
  input: UpdateVoteInput
): Promise<Vote | null> => {
  const vote = await getVoteById(vote_id);

  if (!vote) return null;

  return updateVote(vote_id, input);
};

/* =======================
   DELETE
   ======================= */
export const deleteVoteService = async (vote_id: string): Promise<boolean> => {
  const vote = await getVoteById(vote_id);

  if (!vote) return false;

  return deleteVote(vote_id);
};

/* =======================
   DELETE – BY USER AND ENTITY
   ======================= */
export const deleteVoteByUserAndEntityService = async (
  user_id: string,
  entity_id: string,
  entity_type: string
): Promise<boolean> => {
  return deleteVoteByUserAndEntity(user_id, entity_id, entity_type);
};