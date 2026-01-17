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
import {
  publishCommentCreated,
  publishCommentUpdated,
  publishCommentDeleted,
} from "./comment.events.js";

/* =======================
   CREATE
   ======================= */
export const createCommentService = async (
  input: CreateCommentInput
): Promise<Comment> => {
  const comment = await insertComment(input);

  // emit event (fire-and-forget)
  publishCommentCreated({
    comment_id: comment.comment_id,
    content: comment.content,
    user_id: comment.user_id,
    post_id: comment.post_id,
    comment_created_at: comment.comment_created_at
  }).catch(console.error);

  return comment;
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

  const updatedComment = await updateComment(comment_id, input);

  // emit event (fire-and-forget)
  if (updatedComment) {
    publishCommentUpdated({
      comment_id: updatedComment.comment_id,
      content: updatedComment.content,
      user_id: updatedComment.user_id
    }).catch(console.error);
  }

  return updatedComment;
};

/* =======================
   DELETE
   ======================= */
export const deleteCommentService = async (comment_id: string): Promise<boolean> => {
  const comment = await getCommentById(comment_id);

  if (!comment) return false;

  const result = await deleteComment(comment_id);

  if (result) {
    // emit event (fire-and-forget)
    publishCommentDeleted({
      comment_id: comment.comment_id,
      user_id: comment.user_id
    }).catch(console.error);
  }

  return result;
};