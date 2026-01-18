import { Pool } from 'pg';
import { env } from '../../config/env.js';
import { 
  CreateMembershipInput, 
  UpdateMembershipInput,
  GroupMember 
} from './membership.types.js';

// Initialize database connection pool
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

/**
 * Adds a member to a group
 */
export const addMemberToGroupService = async (
  input: CreateMembershipInput
): Promise<GroupMember> => {
  const {
    group_id,
    user_id,
    role,
  } = input;

  // Start a transaction
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Check if user is already a member
    const existingMemberQuery = `
      SELECT * FROM group_members 
      WHERE group_id = $1 AND user_id = $2 AND is_active = true
    `;
    const existingResult = await client.query(existingMemberQuery, [group_id, user_id]);
    
    if (existingResult.rows.length > 0) {
      throw new Error('User is already a member of this group');
    }
    
    const query = `
      INSERT INTO group_members (
        membership_id,
        group_id,
        user_id,
        role
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const values = [
      crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      group_id,
      user_id,
      role,
    ];

    const { rows } = await client.query(query, values);
    const member = rows[0];
    
    // Update member count in groups table
    const updateCountQuery = `
      UPDATE groups
      SET member_count = member_count + 1
      WHERE group_id = $1
    `;
    
    await client.query(updateCountQuery, [group_id]);
    
    await client.query('COMMIT');
    
    return member;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Gets a group member by membership ID
 */
export const getGroupMemberByIdService = async (
  membershipId: string
): Promise<GroupMember | null> => {
  const query = 'SELECT * FROM group_members WHERE membership_id = $1 AND is_active = true';
  const { rows } = await pool.query(query, [membershipId]);

  return rows.length ? rows[0] : null;
};

/**
 * Gets a group member by group ID and user ID
 */
export const getGroupMemberByGroupAndUserService = async (
  groupId: string,
  userId: string
): Promise<GroupMember | null> => {
  const query = 'SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2 AND is_active = true';
  const { rows } = await pool.query(query, [groupId, userId]);

  return rows.length ? rows[0] : null;
};

/**
 * Gets all members of a group
 */
export const getGroupMembersService = async (
  groupId: string,
  role?: string,
  limit: number = 50,
  offset: number = 0
): Promise<GroupMember[]> => {
  let query = 'SELECT * FROM group_members WHERE group_id = $1 AND is_active = true';
  const params = [groupId];
  
  if (role) {
    query += ' AND role = $2';
    params.push(role);
  }
  
  query += ' ORDER BY joined_at DESC LIMIT $3 OFFSET $4';
  params.push(limit.toString(), offset.toString());

  const { rows } = await pool.query(query, params);
  return rows;
};

/**
 * Gets all groups a user belongs to
 */
export const getUserGroupsService = async (
  userId: string
): Promise<GroupMember[]> => {
  const query = `
    SELECT * FROM group_members 
    WHERE user_id = $1 AND is_active = true
    ORDER BY joined_at DESC
  `;
  const params = [userId];

  const { rows } = await pool.query(query, params);
  return rows;
};

/**
 * Updates a group membership
 */
export const updateGroupMembershipService = async (
  membershipId: string,
  input: UpdateMembershipInput
): Promise<GroupMember | null> => {
  const { role, is_active } = input;
  
  const query = `
    UPDATE group_members
    SET 
      role = COALESCE($1, role),
      is_active = COALESCE($2, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE membership_id = $3
    RETURNING *
  `;
  
  const { rows } = await pool.query(query, [
    role || null,
    is_active,
    membershipId
  ]);
  return rows.length ? rows[0] : null;
};

/**
 * Removes a member from a group
 */
export const removeMemberFromGroupService = async (
  groupId: string,
  userId: string
): Promise<boolean> => {
  // Start a transaction
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const query = `
      UPDATE group_members
      SET is_active = false, left_at = CURRENT_TIMESTAMP
      WHERE group_id = $1 AND user_id = $2 AND is_active = true
      RETURNING membership_id
    `;
    
    const { rows } = await client.query(query, [groupId, userId]);
    
    if (rows.length === 0) {
      await client.query('ROLLBACK');
      return false;
    }
    
    // Update member count in groups table
    const updateCountQuery = `
      UPDATE groups
      SET member_count = GREATEST(0, member_count - 1)
      WHERE group_id = $1
    `;
    
    await client.query(updateCountQuery, [groupId]);
    
    await client.query('COMMIT');
    
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Transfers group ownership
 */
export const transferGroupOwnershipService = async (
  groupId: string,
  newOwnerId: string
): Promise<boolean> => {
  // Start a transaction
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Find the current owner
    const ownerQuery = `
      SELECT user_id FROM group_members 
      WHERE group_id = $1 AND role = 'admin' AND is_active = true
      LIMIT 1
    `;
    const ownerResult = await client.query(ownerQuery, [groupId]);
    
    if (ownerResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return false;
    }
    
    const currentOwnerId = ownerResult.rows[0].user_id;
    
    // Update the new owner to admin role
    const newOwnerQuery = `
      UPDATE group_members
      SET role = 'admin'
      WHERE group_id = $1 AND user_id = $2 AND is_active = true
      RETURNING membership_id
    `;
    const newOwnerResult = await client.query(newOwnerQuery, [groupId, newOwnerId]);
    
    if (newOwnerResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return false;
    }
    
    // Update the previous owner to member role
    const prevOwnerQuery = `
      UPDATE group_members
      SET role = 'member'
      WHERE group_id = $1 AND user_id = $2 AND is_active = true
      RETURNING membership_id
    `;
    await client.query(prevOwnerQuery, [groupId, currentOwnerId]);
    
    await client.query('COMMIT');
    
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};