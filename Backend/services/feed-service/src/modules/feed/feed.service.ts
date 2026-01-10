import { FeedItem, GetFeedInput } from "./feed.types.js";
import {
  getUserFeed,
  getUserFeedCount,
  insertFeedItem,
  removeFeedItemByUserAndPost
} from "./feed.repository.js";

/* =======================
   READ – GET USER FEED
   ======================= */
export const getUserFeedService = async (
  input: GetFeedInput
): Promise<{ items: FeedItem[], total: number }> => {
  const items = await getUserFeed(input);
  const total = await getUserFeedCount(input.user_id);
  
  return { items, total };
};

/* =======================
   CREATE – ADD TO FEED
   ======================= */
export const addToUserService = async (
  user_id: string,
  post_id: string
): Promise<void> => {
  await insertFeedItem(user_id, post_id);
};

/* =======================
   DELETE – REMOVE FROM FEED
   ======================= */
export const removeFromFeedService = async (
  user_id: string,
  post_id: string
): Promise<boolean> => {
  return removeFeedItemByUserAndPost(user_id, post_id);
};