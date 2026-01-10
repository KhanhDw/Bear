import { SearchResult, SearchInput } from "./search.types.js";
import { pool } from "../../db/db.js";

/* SEARCH */
export const searchAll = async ({ query, type = "all", limit = 20, offset = 0 }: SearchInput): Promise<SearchResult[]> => {
  const results: SearchResult[] = [];
  
  // Search posts
  if (type === "all" || type === "post") {
    const postResults = await pool.query(
      `
      SELECT 
        post_id as id,
        'post' as type,
        post_content as content,
        post_author_id as author,
        post_created_at as created_at,
        ts_rank(to_tsvector('english', post_content), plainto_tsquery('english', $1)) as score
      FROM post
      WHERE to_tsvector('english', post_content) @@ plainto_tsquery('english', $1)
      ORDER BY score DESC
      LIMIT $2 OFFSET $3
      `,
      [query, limit, offset]
    );
    
    results.push(...postResults.rows.map(row => ({
      id: row.id,
      type: row.type,
      content: row.content,
      author: row.author,
      created_at: row.created_at,
      score: row.score
    })));
  }
  
  // Search users
  if (type === "all" || type === "user") {
    const userResults = await pool.query(
      `
      SELECT 
        user_id as id,
        'user' as type,
        username as title,
        email as content,
        username as author,
        user_created_at as created_at,
        ts_rank(to_tsvector('english', username || ' ' || email), plainto_tsquery('english', $1)) as score
      FROM users
      WHERE to_tsvector('english', username || ' ' || email) @@ plainto_tsquery('english', $1)
      ORDER BY score DESC
      LIMIT $2 OFFSET $3
      `,
      [query, limit, offset]
    );
    
    results.push(...userResults.rows.map(row => ({
      id: row.id,
      type: row.type,
      title: row.title,
      content: row.content,
      author: row.author,
      created_at: row.created_at,
      score: row.score
    })));
  }
  
  // Search comments
  if (type === "all" || type === "comment") {
    const commentResults = await pool.query(
      `
      SELECT 
        comment_id as id,
        'comment' as type,
        content,
        user_id as author,
        comment_created_at as created_at,
        ts_rank(to_tsvector('english', content), plainto_tsquery('english', $1)) as score
      FROM comments
      WHERE to_tsvector('english', content) @@ plainto_tsquery('english', $1)
      ORDER BY score DESC
      LIMIT $2 OFFSET $3
      `,
      [query, limit, offset]
    );
    
    results.push(...commentResults.rows.map(row => ({
      id: row.id,
      type: row.type,
      content: row.content,
      author: row.author,
      created_at: row.created_at,
      score: row.score
    })));
  }
  
  // Sort all results by score if available, otherwise by creation date
  results.sort((a, b) => {
    if (a.score !== undefined && b.score !== undefined) {
      return b.score - a.score; // Higher score first
    }
    if (a.created_at && b.created_at) {
      return b.created_at.getTime() - a.created_at.getTime(); // Newest first
    }
    return 0;
  });
  
  // Limit the final results
  return results.slice(0, limit);
};

/* COUNT SEARCH RESULTS */
export const countSearchResults = async ({ query, type = "all" }: SearchInput): Promise<number> => {
  let totalCount = 0;
  
  if (type === "all" || type === "post") {
    const postCount = await pool.query(
      `
      SELECT COUNT(*) as count
      FROM post
      WHERE to_tsvector('english', post_content) @@ plainto_tsquery('english', $1)
      `,
      [query]
    );
    totalCount += parseInt(postCount.rows[0].count);
  }
  
  if (type === "all" || type === "user") {
    const userCount = await pool.query(
      `
      SELECT COUNT(*) as count
      FROM users
      WHERE to_tsvector('english', username || ' ' || email) @@ plainto_tsquery('english', $1)
      `,
      [query]
    );
    totalCount += parseInt(userCount.rows[0].count);
  }
  
  if (type === "all" || type === "comment") {
    const commentCount = await pool.query(
      `
      SELECT COUNT(*) as count
      FROM comments
      WHERE to_tsvector('english', content) @@ plainto_tsquery('english', $1)
      `,
      [query]
    );
    totalCount += parseInt(commentCount.rows[0].count);
  }
  
  return totalCount;
};