import { Pool } from 'pg';
import { env } from '../../config/env.js';
import { 
  CreateMessageInput, 
  UpdateMessageInput,
  Message 
} from './message.types.js';

// Initialize database connection pool
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

/**
 * Creates a new message
 */
export const createMessageService = async (
  input: CreateMessageInput
): Promise<Message> => {
  const {
    conversation_id,
    sender_id,
    content,
    message_type,
  } = input;

  const query = `
    INSERT INTO messages (
      message_id,
      conversation_id,
      sender_id,
      content,
      message_type
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const values = [
    crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    conversation_id,
    sender_id,
    content,
    message_type,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

/**
 * Gets all messages for a specific conversation
 */
export const getMessagesByConversationService = async (
  conversationId: string,
  limit: number = 50,
  offset: number = 0
): Promise<Message[]> => {
  const query = `
    SELECT * FROM messages 
    WHERE conversation_id = $1 AND is_deleted = false
    ORDER BY sent_at DESC 
    LIMIT $2 OFFSET $3
  `;
  const params = [conversationId, limit.toString(), offset.toString()];

  const { rows } = await pool.query(query, params);
  return rows;
};

/**
 * Gets a message by ID
 */
export const getMessageByIdService = async (
  messageId: string
): Promise<Message | null> => {
  const query = 'SELECT * FROM messages WHERE message_id = $1 AND is_deleted = false';
  const { rows } = await pool.query(query, [messageId]);

  return rows.length ? rows[0] : null;
};

/**
 * Updates a message
 */
export const updateMessageService = async (
  messageId: string,
  input: UpdateMessageInput
): Promise<Message | null> => {
  const { content } = input;
  
  const query = `
    UPDATE messages
    SET content = $1, updated_at = CURRENT_TIMESTAMP, is_edited = true
    WHERE message_id = $2 AND is_deleted = false
    RETURNING *
  `;
  
  const { rows } = await pool.query(query, [content, messageId]);
  return rows.length ? rows[0] : null;
};

/**
 * Deletes a message (soft delete)
 */
export const deleteMessageService = async (
  messageId: string
): Promise<boolean> => {
  const query = `
    UPDATE messages
    SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
    WHERE message_id = $1
    RETURNING message_id
  `;
  
  const { rows } = await pool.query(query, [messageId]);
  return rows.length > 0;
};

/**
 * Gets recent messages for a user across all conversations
 */
export const getRecentMessagesForUserService = async (
  userId: string,
  limit: number = 20
): Promise<Message[]> => {
  const query = `
    SELECT DISTINCT m.*
    FROM messages m
    JOIN conversation_participants cp ON m.conversation_id = cp.conversation_id
    WHERE cp.user_id = $1 AND m.is_deleted = false
    ORDER BY m.sent_at DESC
    LIMIT $2
  `;
  
  const { rows } = await pool.query(query, [userId, limit.toString()]);
  return rows;
};