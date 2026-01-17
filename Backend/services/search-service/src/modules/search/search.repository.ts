import { SearchResult, SearchInput } from "./search.types.js";
import { pool } from "../../db/db.js";

// Initialize search index table if it doesn't exist
export const initializeSearchIndex = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS search_index (
      id SERIAL PRIMARY KEY,
      entity_id VARCHAR(255) NOT NULL,
      entity_type VARCHAR(50) NOT NULL, -- 'post', 'user', 'comment'
      content TEXT,
      title TEXT,
      author VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_search_entity ON search_index(entity_id, entity_type);
    CREATE INDEX IF NOT EXISTS idx_search_type ON search_index(entity_type);
    CREATE INDEX IF NOT EXISTS idx_search_content_gin ON search_index USING gin(to_tsvector('english', COALESCE(content, '') || ' ' || COALESCE(title, '')));
  `);
};

/* INDEX ENTITY FOR SEARCH */
export const indexEntity = async (
  entityId: string,
  entityType: string,
  content: string,
  title?: string,
  author?: string
): Promise<void> => {
  const existingRecord = await pool.query(
    'SELECT id FROM search_index WHERE entity_id = $1 AND entity_type = $2',
    [entityId, entityType]
  );

  if (existingRecord.rows.length > 0) {
    // Update existing record
    await pool.query(
      `
      UPDATE search_index
      SET content = $3, title = $4, author = $5, updated_at = CURRENT_TIMESTAMP
      WHERE entity_id = $1 AND entity_type = $2
      `,
      [entityId, entityType, content, title, author]
    );
  } else {
    // Insert new record
    await pool.query(
      `
      INSERT INTO search_index (entity_id, entity_type, content, title, author)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [entityId, entityType, content, title, author]
    );
  }
};

/* REMOVE ENTITY FROM SEARCH INDEX */
export const removeEntityFromIndex = async (entityId: string, entityType: string): Promise<void> => {
  await pool.query(
    'DELETE FROM search_index WHERE entity_id = $1 AND entity_type = $2',
    [entityId, entityType]
  );
};

/* SEARCH */
export const searchAll = async ({ query, type = "all", limit = 20, offset = 0 }: SearchInput): Promise<SearchResult[]> => {
  const results: SearchResult[] = [];

  // Build the search query based on type
  let whereClause = '';
  const params: any[] = [query];

  if (type === "all") {
    whereClause = "WHERE to_tsvector('english', COALESCE(content, '') || ' ' || COALESCE(title, '')) @@ plainto_tsquery('english', $1)";
  } else if (type === "post" || type === "user" || type === "comment") {
    whereClause = "WHERE entity_type = $2 AND to_tsvector('english', COALESCE(content, '') || ' ' || COALESCE(title, '')) @@ plainto_tsquery('english', $1)";
    params.push(type); // Add type as second parameter
  }

  // Add limit and offset parameters
  const limitParamIndex = params.length + 1;
  const offsetParamIndex = params.length + 2;
  params.push(limit, offset);

  const searchQuery = `
    SELECT
      entity_id as id,
      entity_type as type,
      content,
      title,
      author,
      created_at,
      updated_at,
      ts_rank(to_tsvector('english', COALESCE(content, '') || ' ' || COALESCE(title, '')), plainto_tsquery('english', $1)) as score
    FROM search_index
    ${whereClause}
    ORDER BY score DESC, updated_at DESC
    LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}
  `;

  const searchResults = await pool.query(searchQuery, params);

  results.push(...searchResults.rows.map(row => ({
    id: row.id,
    type: row.type,
    content: row.content,
    title: row.title || undefined,
    author: row.author,
    created_at: new Date(row.created_at),
    updated_at: new Date(row.updated_at),
    score: parseFloat(row.score)
  })));

  return results.slice(0, limit);
};

/* COUNT SEARCH RESULTS */
export const countSearchResults = async ({ query, type = "all" }: SearchInput): Promise<number> => {
  let whereClause = '';
  const params: any[] = [query];

  if (type === "all") {
    whereClause = "WHERE to_tsvector('english', COALESCE(content, '') || ' ' || COALESCE(title, '')) @@ plainto_tsquery('english', $1)";
  } else if (type === "post" || type === "user" || type === "comment") {
    whereClause = "WHERE entity_type = $2 AND to_tsvector('english', COALESCE(content, '') || ' ' || COALESCE(title, '')) @@ plainto_tsquery('english', $1)";
    params.push(type); // Add type as second parameter
  }

  const countQuery = `
    SELECT COUNT(*) as count
    FROM search_index
    ${whereClause}
  `;

  const result = await pool.query(countQuery, params);
  return parseInt(result.rows[0].count);
};