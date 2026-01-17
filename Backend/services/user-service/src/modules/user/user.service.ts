import { CreateUserInput, UpdateUserInput, User } from "./user.types.js";
import {
  insertUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
} from "./user.repository.js";
import {
  publishUserCreated,
  publishUserUpdated,
  publishUserDeleted,
} from "./user.events.js";

/* =======================
   CREATE
   ======================= */
export const createUserService = async (
  input: CreateUserInput
): Promise<User> => {
  // Check if user with email already exists
  const existingUser = await getUserByEmail(input.email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const user = await insertUser(input);

  // emit event (fire-and-forget)
  publishUserCreated({
    user_id: user.user_id,
    username: user.username,
    email: user.email,
    user_created_at: user.user_created_at
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
   READ – GET BY EMAIL
   ======================= */
export const getUserByEmailService = async (
  email: string
): Promise<User | null> => {
  return getUserByEmail(email);
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

  // If updating email, check if another user already has this email
  if (input.email && input.email !== user.email) {
    const existingUser = await getUserByEmail(input.email);
    if (existingUser) {
      throw new Error("Another user with this email already exists");
    }
  }

  const updatedUser = await updateUser(user_id, input);

  // emit event (fire-and-forget)
  if (updatedUser) {
    publishUserUpdated({
      user_id: updatedUser.user_id,
      username: updatedUser.username,
      email: updatedUser.email
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
      user_id: user.user_id
    }).catch(console.error);
  }

  return result;
};