import { CreateUserInput, UpdateUserInput, User } from "./user.types.js";
import {
  insertUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
} from "./user.repository.js";

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
  
  return insertUser(input);
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

  return updateUser(user_id, input);
};

/* =======================
   DELETE
   ======================= */
export const deleteUserService = async (user_id: string): Promise<boolean> => {
  const user = await getUserById(user_id);

  if (!user) return false;

  return deleteUser(user_id);
};