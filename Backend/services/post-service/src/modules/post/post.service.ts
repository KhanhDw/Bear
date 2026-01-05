import { CreatePostInput, UpdatePostInput, Post } from "./post.types.js";
import {
  insertPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "./post.repository.js";
import { publishPostCreated } from "./post.events.js";

/* CREATE */
export const createPostService = async (
  input: CreatePostInput
): Promise<Post> => {
  const post = await insertPost(input);

  // emit event (không ảnh hưởng luồng chính)
  publishPostCreated(post).catch(console.error);

  return post;
};

/* READ ALL */
export const getPostsService = async (): Promise<Post[]> => {
  return getAllPosts();
};

/* READ ONE */
export const getPostByIdService = async (
  post_id: string
): Promise<Post | null> => {
  return getPostById(post_id);
};

/* UPDATE */
export const updatePostService = async (
  post_id: string,
  input: UpdatePostInput
): Promise<Post | null> => {
  return updatePost(post_id, input);
};

/* DELETE */
export const deletePostService = async (post_id: string): Promise<boolean> => {
  return deletePost(post_id);
};
