/* =======================
   CREATE
   ======================= */

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
}

/* =======================
   MODEL
   ======================= */

export interface User extends CreateUserInput {
  user_id: string;
  user_created_at: Date;
  user_updated_at: Date;
}

/* =======================
   UPDATE
   ======================= */

export type UpdateUserInput = Partial<
  Pick<User, "username" | "email" | "password">
> & {
  user_id: string;
};

/* =======================
   DELETE
   ======================= */

export interface DeleteUserInput {
  user_id: string;
}

/* =======================
   READ – GET ONE
   ======================= */

export interface GetUserInput {
  user_id: string;
}

/* =======================
   READ – LIST
   ======================= */

export interface ListUsersInput {
  search?: string;
  limit?: number;
  offset?: number;
}
