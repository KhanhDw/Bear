/* =======================
   CREATE
   ======================= */

export interface CreatePostInput {
  title: string;
  content: string;
  authorId: string;
}

/* =======================
   MODEL
   ======================= */

export interface Post extends CreatePostInput {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/* =======================
   UPDATE
   ======================= */

export type UpdatePostInput = Partial<Pick<Post, "title" | "content">> & {
  id: string;
};

/* =======================
   DELETE
   ======================= */

export interface DeletePostInput {
  id: string;
}

/* =======================
   READ – GET ONE
   ======================= */

export interface GetPostInput {
  id: string;
}

/* =======================
   READ – LIST
   ======================= */

export interface ListPostsInput {
  authorId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}
