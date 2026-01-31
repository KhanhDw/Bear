import { pool } from "../../db/db.js";
import {
  publishUserCreated,
  publishUserDeleted,
  publishUserUpdated,
} from "./user.events.js";
import {
  checkIfFollowing,
  deleteUser,
  followUser,
  getAllUsers,
  getFollowers,
  getFollowing,
  getUserByAuthId,
  getUserById,
  insertUser,
  unfollowUser,
  updateUser,
} from "./user.repository.js";
import { CreateUserInput, FollowUserInput, UnfollowUserInput, UpdateUserInput, User } from "./user.types.js";

/* =======================
   CREATE
   ======================= */
export const createUserService = async (
  input: CreateUserInput
): Promise<User> => {
  // Check if user with auth_user_id already exists
  const existingUser = await getUserByAuthId(input.auth_user_id);
  if (existingUser) {
    throw new Error("User profile with this authentication ID already exists");
  }

  // Check if username is already taken
  const existingUsername = await getUserByUsername(input.username);
  if (existingUsername) {
    throw new Error("Username is already taken");
  }

  const user = await insertUser(input);

  // emit event (fire-and-forget)
  publishUserCreated({
    user_id: user.user_id,
    auth_user_id: user.auth_user_id,
    username: user.username,
    display_name: user.display_name,
    user_created_at: user.created_at
  }).catch(console.error);

  return user;
};

/* =======================
   READ – LIST
   ======================= */
export const getUsersService = async (): Promise<User[]> => {
  return getAllUsers();
};

/* =======================
   READ – GET ONE
   ======================= */
export const getUserByIdService = async (
  user_id: string
): Promise<User | null> => {
  return getUserById(user_id);
};

/* =======================
   READ – GET BY AUTH ID
   ======================= */
export const getUserByAuthIdService = async (
  auth_user_id: string
): Promise<User | null> => {
  return getUserByAuthId(auth_user_id);
};

/* =======================
   READ – GET BY USERNAME
   ======================= */
export const getUserByUsername = async (
  username: string
): Promise<User | null> => {
  const result = await pool.query(
    `
    SELECT
      user_id,
      auth_user_id,
      username,
      display_name,
      avatar_url,
      bio,
      is_active,
      created_at,
      updated_at
    FROM users
    WHERE username = $1
    `,
    [username]
  );
  return result.rows[0] || null;
};

/* =======================
   UPDATE
   ======================= */
export const updateUserService = async (
  user_id: string,
  input: UpdateUserInput
): Promise<User | null> => {
  const user = await getUserById(user_id);

  if (!user) return null;

  // If updating username, check if another user already has this username
  if (input.username && input.username !== user.username) {
    const existingUser = await getUserByUsername(input.username);
    if (existingUser) {
      throw new Error("Username is already taken");
    }
  }

  const updatedUser = await updateUser(user_id, input);

  // emit event (fire-and-forget)
  if (updatedUser) {
    publishUserUpdated({
      user_id: updatedUser.user_id,
      auth_user_id: updatedUser.auth_user_id,
      username: updatedUser.username,
      display_name: updatedUser.display_name
    }).catch(console.error);
  }

  return updatedUser;
};

/* =======================
   DELETE
   ======================= */
export const deleteUserService = async (user_id: string): Promise<boolean> => {
  const user = await getUserById(user_id);

  if (!user) return false;

  const result = await deleteUser(user_id);

  if (result) {
    // emit event (fire-and-forget)
    publishUserDeleted({
      user_id: user.user_id,
      auth_user_id: user.auth_user_id
    }).catch(console.error);
  }

  return result;
};

/* =======================
   FOLLOW OPERATIONS
   ======================= */
export const followUserService = async (input: FollowUserInput): Promise<boolean> => {
  // Prevent user from following themselves
  if (input.follower_id === input.following_id) {
    throw new Error("User cannot follow themselves");
  }

  return await followUser(input);
};

export const unfollowUserService = async (input: UnfollowUserInput): Promise<boolean> => {
  return await unfollowUser(input);
};

export const getFollowersService = async (user_id: string, limit: number = 20, offset: number = 0): Promise<User[]> => {
  return await getFollowers(user_id, limit, offset);
};

export const getFollowingService = async (user_id: string, limit: number = 20, offset: number = 0): Promise<User[]> => {
  return await getFollowing(user_id, limit, offset);
};

export const checkIfFollowingService = async (follower_id: string, following_id: string): Promise<boolean> => {
  return await checkIfFollowing(follower_id, following_id);
};