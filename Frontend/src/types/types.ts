export interface Post {
  key?: string;
  post_id: string;
  post_author_id: string;
  post_author_name: string;
  post_content: string;
  post_created_at: string;
  upvotes: number;
  downvotes: number;
  comments_count: number;
}
