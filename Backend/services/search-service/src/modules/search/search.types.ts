/* =======================
   SEARCH RESULT MODEL
   ======================= */

export interface SearchResult {
  id: string;
  type: "post" | "user" | "comment";
  title?: string;
  content?: string;
  author?: string;
  created_at?: Date;
  score?: number; // relevance score
}

/* =======================
   INPUT TYPES
   ======================= */

export interface SearchInput {
  query: string;
  type?: "post" | "user" | "comment" | "all";
  limit?: number;
  offset?: number;
}