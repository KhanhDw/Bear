import { RequestContext } from "src/shared/request-context.js";
import {
  publishPostCreated,
  publishPostDeleted,
  publishPostUpdated,
} from "./post.events.js";
import {
  deletePost,
  getAllPosts,
  getPostById,
  insertPost,
  updatePost,
} from "./post.repository.js";
import { CreatePostInput, Post, UpdatePostInput } from "./post.types.js";


/* =======================
   CREATE
   ======================= */
export const createPostService = async (
  input: CreatePostInput,
  ctx?: { traceId?: string },
): Promise<Post> => {
  const post = await insertPost(input);
  publishPostCreated(post, ctx).catch(console.error);
  return post;
};

/* =======================
   READ – LIST
   ======================= */
export const getPostsService = async (): Promise<Post[]> => {
  return getAllPosts();
};

/* =======================
   READ – GET ONE
   ======================= */
export const getPostByIdService = async (
  post_id: string,
): Promise<Post | null> => {
  return getPostById(post_id);
};

/* =======================
   UPDATE
   ======================= */
export const updatePostService = async (
  post_id: string,
  input: UpdatePostInput,
  ctx?: RequestContext
): Promise<Post | null> => {
  const post = await updatePost(post_id, input);

  if (post) {
    publishPostUpdated(post, ctx).catch(console.error);
  }

  return post;
};


/* =======================
   DELETE
   ======================= */
export const deletePostService = async (post_id: string): Promise<boolean> => {
  const post = await getPostById(post_id);

  if (!post) return false;

  const success = await deletePost(post_id);

  if (success) {
    publishPostDeleted({
      post_id: post.post_id,
      post_author_id: post.post_author_id,
    }).catch(console.error);
  }

  return success;
};
