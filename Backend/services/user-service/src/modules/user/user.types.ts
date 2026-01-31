/* =======================
   CREATE
   ======================= */

export interface CreateUserInput {
  auth_user_id: string;  // Reference to auth service user
  username: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
}

/* =======================
   MODEL
   ======================= */

export interface User {
  user_id: string;
  auth_user_id: string;  // Reference to auth service user
  username: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

/* =======================
   UPDATE
   ======================= */

export type UpdateUserInput = Partial<
  Pick<User, "username" | "display_name" | "avatar_url" | "bio">
> & {
  user_id: string;
};

/* =======================
   DELETE
   ======================= */

export interface DeleteUserInput {
  user_id: string;
}

/* =======================
   READ – GET ONE
   ======================= */

export interface GetUserInput {
  user_id: string;
}

/* =======================
   READ – LIST
   ======================= */

export interface ListUsersInput {
  search?: string;
  limit?: number;
  offset?: number;
}

/* =======================
   FOLLOW
   ======================= */

export interface FollowUserInput {
  follower_id: string;  // The user who is following
  following_id: string; // The user being followed
}

/* =======================
   UNFOLLOW
   ======================= */

export interface UnfollowUserInput {
  follower_id: string;  // The user who was following
  following_id: string; // The user who was being followed
}

/* =======================
   GET FOLLOWERS
   ======================= */

export interface GetFollowersInput {
  user_id: string;
  limit?: number;
  offset?: number;
}

/* =======================
   GET FOLLOWING
   ======================= */

export interface GetFollowingInput {
  user_id: string;
  limit?: number;
  offset?: number;
}
