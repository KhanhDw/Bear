import { Pool } from 'pg';
import { env } from '../../config/env.js';
import { 
  CreateGroupInput, 
  UpdateGroupInput,
  Group 
} from './group.types.js';

// Initialize database connection pool
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

/**
 * Creates a new group
 */
export const createGroupService = async (
  input: CreateGroupInput
): Promise<Group> => {
  const {
    name,
    description,
    creator_id,
    privacy_level,
    avatar_url,
    cover_image_url,
  } = input;

  // Start a transaction
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const query = `
      INSERT INTO groups (
        group_id,
        name,
        description,
        creator_id,
        privacy_level,
        avatar_url,
        cover_image_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      name,
      description || null,
      creator_id,
      privacy_level,
      avatar_url || null,
      cover_image_url || null,
    ];

    const { rows } = await client.query(query, values);
    const group = rows[0];
    
    // Add the creator as an admin member
    const memberQuery = `
      INSERT INTO group_members (
        membership_id,
        group_id,
        user_id,
        role
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    await client.query(memberQuery, [
      crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      group.group_id,
      creator_id,
      'admin'
    ]);
    
    // Update member count
    const updateCountQuery = `
      UPDATE groups
      SET member_count = member_count + 1
      WHERE group_id = $1
    `;
    
    await client.query(updateCountQuery, [group.group_id]);
    
    await client.query('COMMIT');
    
    return group;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Gets a group by ID
 */
export const getGroupByIdService = async (
  groupId: string
): Promise<Group | null> => {
  const query = 'SELECT * FROM groups WHERE group_id = $1 AND is_active = true';
  const { rows } = await pool.query(query, [groupId]);

  return rows.length ? rows[0] : null;
};

/**
 * Gets all groups with pagination
 */
export const getAllGroupsService = async (
  limit: number = 20,
  offset: number = 0
): Promise<Group[]> => {
  const query = `
    SELECT * FROM groups 
    WHERE is_active = true
    ORDER BY created_at DESC 
    LIMIT $1 OFFSET $2
  `;
  const params = [limit.toString(), offset.toString()];

  const { rows } = await pool.query(query, params);
  return rows;
};

/**
 * Gets groups by privacy level
 */
export const getGroupsByPrivacyService = async (
  privacyLevel: string,
  limit: number = 20,
  offset: number = 0
): Promise<Group[]> => {
  const query = `
    SELECT * FROM groups 
    WHERE privacy_level = $1 AND is_active = true
    ORDER BY created_at DESC 
    LIMIT $2 OFFSET $3
  `;
  const params = [privacyLevel, limit.toString(), offset.toString()];

  const { rows } = await pool.query(query, params);
  return rows;
};

/**
 * Gets groups by creator
 */
export const getGroupsByCreatorService = async (
  creatorId: string
): Promise<Group[]> => {
  const query = `
    SELECT * FROM groups 
    WHERE creator_id = $1 AND is_active = true
    ORDER BY created_at DESC
  `;
  const params = [creatorId];

  const { rows } = await pool.query(query, params);
  return rows;
};

/**
 * Updates a group
 */
export const updateGroupService = async (
  groupId: string,
  input: UpdateGroupInput
): Promise<Group | null> => {
  const { name, description, privacy_level, avatar_url, cover_image_url, is_active } = input;
  
  const query = `
    UPDATE groups
    SET 
      name = COALESCE($1, name),
      description = COALESCE($2, description),
      privacy_level = COALESCE($3, privacy_level),
      avatar_url = COALESCE($4, avatar_url),
      cover_image_url = COALESCE($5, cover_image_url),
      is_active = COALESCE($6, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE group_id = $7
    RETURNING *
  `;
  
  const { rows } = await pool.query(query, [
    name || null,
    description || null,
    privacy_level || null,
    avatar_url || null,
    cover_image_url || null,
    is_active,
    groupId
  ]);
  return rows.length ? rows[0] : null;
};

/**
 * Deletes a group (soft delete)
 */
export const deleteGroupService = async (
  groupId: string
): Promise<boolean> => {
  const query = `
    UPDATE groups
    SET is_active = false, updated_at = CURRENT_TIMESTAMP
    WHERE group_id = $1
    RETURNING group_id
  `;
  
  const { rows } = await pool.query(query, [groupId]);
  return rows.length > 0;
};

/**
 * Searches groups by name
 */
export const searchGroupsByNameService = async (
  searchTerm: string,
  limit: number = 20
): Promise<Group[]> => {
  const query = `
    SELECT * FROM groups 
    WHERE name ILIKE $1 AND is_active = true AND privacy_level = 'public'
    ORDER BY created_at DESC 
    LIMIT $2
  `;
  const params = [`%${searchTerm}%`, limit.toString()];

  const { rows } = await pool.query(query, params);
  return rows;
};