import { FeedItem, GetFeedInput } from "./feed.types.js";
import { randomUUID } from "crypto";
import { pool } from "../../db/db.js";

/* CREATE */
export const insertFeedItem = async (user_id: string, post_id: string): Promise<void> => {
  await pool.query(
    `
    INSERT INTO feed (
      feed_id,
      user_id,
      post_id,
      feed_created_at
    )
    VALUES ($1, $2, $3, $4)
    `,
    [
      randomUUID(),
      user_id,
      post_id,
      new Date()
    ]
  );
};

/* READ - user feed */
export const getUserFeed = async ({ user_id, limit = 20, offset = 0 }: GetFeedInput): Promise<FeedItem[]> => {
  // This query joins with posts to get the post content and metadata
  // In a real implementation, you might want to join with a posts service via API calls
  // For simplicity in this demo, we'll assume posts are accessible directly
  const result = await pool.query(
    `
    SELECT 
      f.feed_id,
      f.user_id,
      f.post_id,
      p.post_content,
      p.post_author_id,
      p.post_created_at,
      f.feed_created_at
    FROM feed f
    LEFT JOIN post p ON f.post_id = p.post_id
    WHERE f.user_id = $1
    ORDER BY f.feed_created_at DESC
    LIMIT $2 OFFSET $3
    `,
    [user_id, limit, offset]
  );

  return result.rows;
};

/* READ - count user feed */
export const getUserFeedCount = async (user_id: string): Promise<number> => {
  const result = await pool.query(
    `
    SELECT COUNT(*) as count
    FROM feed
    WHERE user_id = $1
    `,
    [user_id]
  );

  return parseInt(result.rows[0].count);
};

/* DELETE */
export const removeFeedItem = async (feed_id: string): Promise<boolean> => {
  const result = await pool.query(
    `
    DELETE FROM feed
    WHERE feed_id = $1
    `,
    [feed_id]
  );

  return result.rowCount === 1;
};

/* DELETE BY USER AND POST */
export const removeFeedItemByUserAndPost = async (user_id: string, post_id: string): Promise<boolean> => {
  const result = await pool.query(
    `
    DELETE FROM feed
    WHERE user_id = $1 AND post_id = $2
    `,
    [user_id, post_id]
  );

  return result.rowCount === 1;
};