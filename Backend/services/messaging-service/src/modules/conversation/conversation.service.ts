import { Pool } from 'pg';
import { env } from '../../config/env.js';
import { 
  CreateConversationInput, 
  UpdateConversationInput,
  Conversation 
} from './conversation.types.js';

// Initialize database connection pool
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

/**
 * Creates a new conversation
 */
export const createConversationService = async (
  input: CreateConversationInput
): Promise<Conversation> => {
  const {
    type,
    name,
    participant_ids,
  } = input;

  // Start a transaction
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Create the conversation
    const conversationQuery = `
      INSERT INTO conversations (
        conversation_id,
        type,
        name
      )
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const conversationValues = [
      crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      type,
      name || null,
    ];

    const conversationResult = await client.query(conversationQuery, conversationValues);
    const conversation = conversationResult.rows[0];
    
    // Add participants to the conversation
    const participantPromises = participant_ids.map(async (userId) => {
      const participantQuery = `
        INSERT INTO conversation_participants (
          conversation_id,
          user_id
        )
        VALUES ($1, $2)
        RETURNING *
      `;
      
      await client.query(participantQuery, [conversation.conversation_id, userId]);
    });
    
    await Promise.all(participantPromises);
    
    await client.query('COMMIT');
    
    return conversation;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Gets a conversation by ID
 */
export const getConversationByIdService = async (
  conversationId: string
): Promise<Conversation | null> => {
  const query = 'SELECT * FROM conversations WHERE conversation_id = $1';
  const { rows } = await pool.query(query, [conversationId]);

  return rows.length ? rows[0] : null;
};

/**
 * Gets all conversations for a user
 */
export const getUserConversationsService = async (
  userId: string
): Promise<Conversation[]> => {
  const query = `
    SELECT DISTINCT c.*
    FROM conversations c
    JOIN conversation_participants cp ON c.conversation_id = cp.conversation_id
    WHERE cp.user_id = $1 AND cp.is_active = true
    ORDER BY c.updated_at DESC
  `;
  
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

/**
 * Updates a conversation
 */
export const updateConversationService = async (
  conversationId: string,
  input: UpdateConversationInput
): Promise<Conversation | null> => {
  const { name } = input;
  
  const query = `
    UPDATE conversations
    SET name = $1, updated_at = CURRENT_TIMESTAMP
    WHERE conversation_id = $2
    RETURNING *
  `;
  
  const { rows } = await pool.query(query, [name || null, conversationId]);
  return rows.length ? rows[0] : null;
};

/**
 * Adds a participant to a conversation
 */
export const addParticipantToConversationService = async (
  conversationId: string,
  userId: string
): Promise<boolean> => {
  const query = `
    INSERT INTO conversation_participants (
      conversation_id,
      user_id
    )
    VALUES ($1, $2)
    ON CONFLICT (conversation_id, user_id, is_active)
    DO UPDATE SET is_active = true, left_at = NULL
    RETURNING participant_id
  `;
  
  const { rows } = await pool.query(query, [conversationId, userId]);
  return rows.length > 0;
};

/**
 * Removes a participant from a conversation
 */
export const removeParticipantFromConversationService = async (
  conversationId: string,
  userId: string
): Promise<boolean> => {
  const query = `
    UPDATE conversation_participants
    SET is_active = false, left_at = CURRENT_TIMESTAMP
    WHERE conversation_id = $1 AND user_id = $2
    RETURNING participant_id
  `;
  
  const { rows } = await pool.query(query, [conversationId, userId]);
  return rows.length > 0;
};

/**
 * Deletes a conversation (soft delete by removing participants)
 */
export const deleteConversationService = async (
  conversationId: string
): Promise<boolean> => {
  // In a real implementation, you might want to soft delete by deactivating participants
  // For now, we'll just mark all participants as inactive
  const query = `
    UPDATE conversation_participants
    SET is_active = false, left_at = CURRENT_TIMESTAMP
    WHERE conversation_id = $1
  `;
  
  const result = await pool.query(query, [conversationId]);
  return result.rowCount !== null && result.rowCount > 0;
};