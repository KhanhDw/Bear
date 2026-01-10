/* =======================
   FEED ITEM MODEL
   ======================= */

export interface FeedItem {
  feed_id: string;
  user_id: string;
  post_id: string;
  post_content: string;
  post_author_id: string;
  post_created_at: Date;
  feed_created_at: Date;
}

/* =======================
   INPUT TYPES
   ======================= */

export interface GetFeedInput {
  user_id: string;
  limit?: number;
  offset?: number;
}

export interface CreateFeedItemInput {
  user_id: string;
  post_id: string;
}