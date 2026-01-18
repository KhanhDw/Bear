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
  user_vote?: 'up' | 'down' | null;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  content: string;
  created_at: string;
  likes_count: number;
  parent_id?: string;
  user_liked?: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  created_at?: string;
}
