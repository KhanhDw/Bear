/* =======================
   CREATE
   ======================= */

export interface CreateVoteInput {
  user_id: string;
  entity_id: string; // can be post_id or comment_id
  entity_type: "post" | "comment"; // type of entity being voted on
  vote_type: "upvote" | "downvote"; // type of vote
}

/* =======================
   MODEL
   ======================= */

export interface Vote extends CreateVoteInput {
  vote_id: string;
  vote_created_at: Date;
  vote_updated_at: Date;
}

/* =======================
   UPDATE
   ======================= */

export type UpdateVoteInput = Partial<Pick<Vote, "vote_type">> & {
  vote_id: string;
};

/* =======================
   DELETE
   ======================= */

export interface DeleteVoteInput {
  vote_id: string;
}

/* =======================
   READ – GET ONE
   ======================= */

export interface GetVoteInput {
  vote_id: string;
}

/* =======================
   READ – LIST
   ======================= */

export interface ListVotesInput {
  user_id?: string;
  entity_id?: string;
  entity_type?: "post" | "comment";
  vote_type?: "upvote" | "downvote";
  limit?: number;
  offset?: number;
}

/* =======================
   AGGREGATE VOTE COUNT
   ======================= */

export interface VoteCount {
  entity_id: string;
  upvotes: number;
  downvotes: number;
  net_score: number; // upvotes - downvotes
}