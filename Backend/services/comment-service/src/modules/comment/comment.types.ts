/* =======================
   CREATE
   ======================= */

export interface CreateCommentInput {
  post_id: string;
  user_id: string;
  content: string;
}

/* =======================
   MODEL
   ======================= */

export interface Comment extends CreateCommentInput {
  comment_id: string;
  comment_created_at: Date;
  comment_updated_at: Date;
}

/* =======================
   UPDATE
   ======================= */

export type UpdateCommentInput = Partial<Pick<Comment, "content">> & {
  comment_id: string;
};

/* =======================
   DELETE
   ======================= */

export interface DeleteCommentInput {
  comment_id: string;
}

/* =======================
   READ – GET ONE
   ======================= */

export interface GetCommentInput {
  comment_id: string;
}

/* =======================
   READ – LIST
   ======================= */

export interface ListCommentsInput {
  post_id?: string;
  user_id?: string;
  limit?: number;
  offset?: number;
}