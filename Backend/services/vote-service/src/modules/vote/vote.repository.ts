import { CreateVoteInput, UpdateVoteInput, Vote, ListVotesInput, VoteCount } from "./vote.types.js";
import { randomUUID } from "crypto";
import { pool } from "../../db/db.js";

/* CREATE */
export const insertVote = async (input: CreateVoteInput): Promise<Vote> => {
  // First check if user already voted on this entity
  const existingVote = await getVoteByUserAndEntity(input.user_id, input.entity_id, input.entity_type);
  
  let result;
  if (existingVote) {
    // Update existing vote
    result = await pool.query(
      `
      UPDATE votes
      SET vote_type = $1, vote_updated_at = $2
      WHERE vote_id = $3
      RETURNING *
      `,
      [input.vote_type, new Date(), existingVote.vote_id]
    );
  } else {
    // Insert new vote
    result = await pool.query(
      `
      INSERT INTO votes (
        vote_id,
        user_id,
        entity_id,
        entity_type,
        vote_type,
        vote_created_at,
        vote_updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $6)
      RETURNING *
      `,
      [
        randomUUID(),
        input.user_id,
        input.entity_id,
        input.entity_type,
        input.vote_type,
        new Date()
      ]
    );
  }

  return result.rows[0];
};

/* READ - all */
export const getAllVotes = async (): Promise<Vote[]> => {
  const result = await pool.query(
    `
    SELECT *
    FROM votes
    ORDER BY vote_created_at DESC
    `
  );

  return result.rows;
};

/* READ - by id */
export const getVoteById = async (vote_id: string): Promise<Vote | null> => {
  const result = await pool.query(
    `
    SELECT *
    FROM votes
    WHERE vote_id = $1
    `,
    [vote_id]
  );

  return result.rows[0] || null;
};

/* READ - by user and entity */
export const getVoteByUserAndEntity = async (user_id: string, entity_id: string, entity_type: string): Promise<Vote | null> => {
  const result = await pool.query(
    `
    SELECT *
    FROM votes
    WHERE user_id = $1 AND entity_id = $2 AND entity_type = $3
    `,
    [user_id, entity_id, entity_type]
  );

  return result.rows[0] || null;
};

/* READ - by user */
export const getVotesByUser = async (user_id: string): Promise<Vote[]> => {
  const result = await pool.query(
    `
    SELECT *
    FROM votes
    WHERE user_id = $1
    ORDER BY vote_created_at DESC
    `,
    [user_id]
  );

  return result.rows;
};

/* READ - by entity */
export const getVotesByEntity = async (entity_id: string, entity_type: string): Promise<Vote[]> => {
  const result = await pool.query(
    `
    SELECT *
    FROM votes
    WHERE entity_id = $1 AND entity_type = $2
    ORDER BY vote_created_at DESC
    `,
    [entity_id, entity_type]
  );

  return result.rows;
};

/* READ - by criteria */
export const getVotes = async ({ user_id, entity_id, entity_type, vote_type, limit = 20, offset = 0 }: ListVotesInput): Promise<Vote[]> => {
  let query = `
    SELECT *
    FROM votes
    WHERE 1=1
  `;
  const params: any[] = [];
  let paramIndex = 1;

  if (user_id) {
    query += ` AND user_id = $${paramIndex}`;
    params.push(user_id);
    paramIndex++;
  }
  if (entity_id) {
    query += ` AND entity_id = $${paramIndex}`;
    params.push(entity_id);
    paramIndex++;
  }
  if (entity_type) {
    query += ` AND entity_type = $${paramIndex}`;
    params.push(entity_type);
    paramIndex++;
  }
  if (vote_type) {
    query += ` AND vote_type = $${paramIndex}`;
    params.push(vote_type);
    paramIndex++;
  }

  query += ` ORDER BY vote_created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);

  return result.rows;
};

/* READ - count votes for an entity */
export const getVoteCountsByEntity = async (entity_id: string, entity_type: string): Promise<VoteCount> => {
  const result = await pool.query(
    `
    SELECT 
      entity_id,
      SUM(CASE WHEN vote_type = 'upvote' THEN 1 ELSE 0 END) as upvotes,
      SUM(CASE WHEN vote_type = 'downvote' THEN 1 ELSE 0 END) as downvotes,
      SUM(CASE WHEN vote_type = 'upvote' THEN 1 ELSE -1 END) as net_score
    FROM votes
    WHERE entity_id = $1 AND entity_type = $2
    GROUP BY entity_id
    `,
    [entity_id, entity_type]
  );

  if (result.rows.length === 0) {
    return {
      entity_id,
      upvotes: 0,
      downvotes: 0,
      net_score: 0
    };
  }

  return result.rows[0];
};

/* READ - count votes by user */
export const getVoteCountsByUser = async (user_id: string): Promise<{ total_votes: number, upvotes: number, downvotes: number }> => {
  const result = await pool.query(
    `
    SELECT 
      COUNT(*) as total_votes,
      SUM(CASE WHEN vote_type = 'upvote' THEN 1 ELSE 0 END) as upvotes,
      SUM(CASE WHEN vote_type = 'downvote' THEN 1 ELSE 0 END) as downvotes
    FROM votes
    WHERE user_id = $1
    `,
    [user_id]
  );

  const row = result.rows[0];
  return {
    total_votes: parseInt(row.total_votes),
    upvotes: parseInt(row.upvotes),
    downvotes: parseInt(row.downvotes)
  };
};

/* UPDATE */
export const updateVote = async (
  vote_id: string,
  input: UpdateVoteInput
): Promise<Vote | null> => {
  const result = await pool.query(
    `
    UPDATE votes
    SET vote_type = $1, vote_updated_at = $2
    WHERE vote_id = $3
    RETURNING *
    `,
    [input.vote_type, new Date(), vote_id]
  );

  return result.rows[0] || null;
};

/* DELETE */
export const deleteVote = async (vote_id: string): Promise<boolean> => {
  const result = await pool.query(
    `
    DELETE FROM votes
    WHERE vote_id = $1
    `,
    [vote_id]
  );

  return result.rowCount === 1;
};

/* DELETE - by user and entity */
export const deleteVoteByUserAndEntity = async (user_id: string, entity_id: string, entity_type: string): Promise<boolean> => {
  const result = await pool.query(
    `
    DELETE FROM votes
    WHERE user_id = $1 AND entity_id = $2 AND entity_type = $3
    `,
    [user_id, entity_id, entity_type]
  );

  return result.rowCount === 1;
};