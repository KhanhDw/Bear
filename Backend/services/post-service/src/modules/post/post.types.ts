/* =======================
   CREATE
   ======================= */

export interface CreatePostInput {
  post_content: string;
  post_author_id: string;
}

/* =======================
   MODEL
   ======================= */

export interface Post extends CreatePostInput {
  post_id: string;
  post_created_at: Date;
}

/* =======================
   UPDATE
   ======================= */

export type UpdatePostInput = Partial<Pick<Post, "post_content">> & {
  post_id: string;
};

/* =======================
   DELETE
   ======================= */

export interface DeletePostInput {
  post_id: string;
}

/* =======================
   READ – GET ONE
   ======================= */

export interface GetPostInput {
  post_id: string;
}

/* =======================
   READ – LIST
   ======================= */

export interface ListPostsInput {
  post_author_id?: string;
  search?: string;
  limit?: number;
  offset?: number;
}
