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
import { CreatePostInput, Post, UpdatePostInput, ListPostsInput, PaginatedResponse } from "./post.types.js";


/* =======================
   CREATE
   ======================= */
export const createPostService = async (
  input: CreatePostInput,
  ctx?: { traceId?: string },
): Promise<Post> => {
  // Basic validation
  if (!input.post_content || input.post_content.trim().length === 0) {
    throw new Error('Post content is required');
  }

  if (!input.post_author_id || input.post_author_id.trim().length === 0) {
    throw new Error('Post author ID is required');
  }

  const post = await insertPost(input);
  publishPostCreated(post, ctx).catch(error => {
    console.error('Failed to publish PostCreated event:', error);
  });
  return post;
};

/* =======================
   READ – LIST with pagination and filtering
   ======================= */
export const getPostsService = async (options?: ListPostsInput): Promise<PaginatedResponse<Post>> => {
  return getAllPosts(options);
};

/* =======================
   READ – GET ONE
   ======================= */
export const getPostByIdService = async (
  post_id: string,
): Promise<Post | null> => {
  if (!post_id || post_id.trim().length === 0) {
    throw new Error('Post ID is required');
  }

  return getPostById(post_id);
};

/* =======================
   UPDATE with authorization check
   ======================= */
export const updatePostService = async (
  post_id: string,
  input: UpdatePostInput,
  currentUser?: { userId: string },
  ctx?: RequestContext
): Promise<Post | null> => {
  if (!post_id || post_id.trim().length === 0) {
    throw new Error('Post ID is required');
  }

  const existingPost = await getPostById(post_id);

  if (!existingPost) {
    return null;
  }

  // Authorization check: only allow author to update their post
  if (currentUser && existingPost.post_author_id !== currentUser.userId) {
    throw new Error('Not authorized to update this post');
  }

  // Validation
  if (input.post_content !== undefined && (!input.post_content || input.post_content.trim().length === 0)) {
    throw new Error('Post content cannot be empty');
  }

  const post = await updatePost(post_id, input);

  if (post) {
    publishPostUpdated(post, ctx).catch(error => {
      console.error('Failed to publish PostUpdated event:', error);
    });
  }

  return post;
};

/* =======================
   DELETE with authorization check
   ======================= */
export const deletePostService = async (
  post_id: string,
  currentUser?: { userId: string }
): Promise<boolean> => {
  if (!post_id || post_id.trim().length === 0) {
    throw new Error('Post ID is required');
  }

  const post = await getPostById(post_id);

  if (!post) return false;

  // Authorization check: only allow author to delete their post
  if (currentUser && post.post_author_id !== currentUser.userId) {
    throw new Error('Not authorized to delete this post');
  }

  const success = await deletePost(post_id);

  if (success) {
    publishPostDeleted({
      post_id: post.post_id,
      post_author_id: post.post_author_id,
    }).catch(error => {
      console.error('Failed to publish PostDeleted event:', error);
    });
  }

  return success;
};
