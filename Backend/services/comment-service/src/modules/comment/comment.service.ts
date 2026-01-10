import { CreateCommentInput, UpdateCommentInput, Comment } from "./comment.types.js";
import {
  insertComment,
  getAllComments,
  getCommentById,
  getCommentsByPostId,
  getCommentsByUserId,
  updateComment,
  deleteComment,
} from "./comment.repository.js";

/* =======================
   CREATE
   ======================= */
export const createCommentService = async (
  input: CreateCommentInput
): Promise<Comment> => {
  return insertComment(input);
};

/* =======================
   READ – LIST
   ======================= */
export const getCommentsService = async (): Promise<Comment[]> => {
  return getAllComments();
};

/* =======================
   READ – GET ONE
   ======================= */
export const getCommentByIdService = async (
  comment_id: string
): Promise<Comment | null> => {
  return getCommentById(comment_id);
};

/* =======================
   READ – GET BY POST ID
   ======================= */
export const getCommentsByPostIdService = async (
  post_id: string
): Promise<Comment[]> => {
  return getCommentsByPostId(post_id);
};

/* =======================
   READ – GET BY USER ID
   ======================= */
export const getCommentsByUserIdService = async (
  user_id: string
): Promise<Comment[]> => {
  return getCommentsByUserId(user_id);
};

/* =======================
   UPDATE
   ======================= */
export const updateCommentService = async (
  comment_id: string,
  input: UpdateCommentInput
): Promise<Comment | null> => {
  const comment = await getCommentById(comment_id);

  if (!comment) return null;

  return updateComment(comment_id, input);
};

/* =======================
   DELETE
   ======================= */
export const deleteCommentService = async (comment_id: string): Promise<boolean> => {
  const comment = await getCommentById(comment_id);

  if (!comment) return false;

  return deleteComment(comment_id);
};