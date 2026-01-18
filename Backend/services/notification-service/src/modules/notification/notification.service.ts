import { Pool } from 'pg';
import { env } from '../../../config/env.js';
import { 
  CreateNotificationInput, 
  UpdateNotificationInput, 
  Notification 
} from './notification.types.js';

// Initialize database connection pool
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

/**
 * Creates a new notification
 */
export const createNotificationService = async (
  input: CreateNotificationInput
): Promise<Notification> => {
  const {
    recipient_user_id,
    sender_user_id,
    type,
    title,
    content,
    entity_id,
    entity_type,
  } = input;

  const query = `
    INSERT INTO notifications (
      notification_id,
      recipient_user_id,
      sender_user_id,
      type,
      title,
      content,
      entity_id,
      entity_type
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;

  const values = [
    crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    recipient_user_id,
    sender_user_id || null,
    type,
    title,
    content || null,
    entity_id || null,
    entity_type || null,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

/**
 * Gets all notifications for a specific user
 */
export const getUserNotificationsService = async (
  userId: string,
  isRead?: boolean,
  limit: number = 20,
  offset: number = 0
): Promise<Notification[]> => {
  let query = 'SELECT * FROM notifications WHERE recipient_user_id = $1';
  const params = [userId];

  if (isRead !== undefined) {
    query += ` AND is_read = ${isRead}`;
  }

  query += ' ORDER BY created_at DESC LIMIT $2 OFFSET $3';
  params.push(limit.toString(), offset.toString());

  const { rows } = await pool.query(query, params);
  return rows;
};

/**
 * Gets a notification by ID
 */
export const getNotificationByIdService = async (
  notificationId: string
): Promise<Notification | null> => {
  const query = 'SELECT * FROM notifications WHERE notification_id = $1';
  const { rows } = await pool.query(query, [notificationId]);

  return rows.length ? rows[0] : null;
};

/**
 * Updates a notification (typically to mark as read)
 */
export const updateNotificationService = async (
  notificationId: string,
  input: UpdateNotificationInput
): Promise<Notification | null> => {
  const { is_read } = input;
  
  const query = `
    UPDATE notifications
    SET is_read = $1, updated_at = CURRENT_TIMESTAMP
    WHERE notification_id = $2
    RETURNING *
  `;
  
  const { rows } = await pool.query(query, [is_read, notificationId]);
  return rows.length ? rows[0] : null;
};

/**
 * Marks all notifications for a user as read
 */
export const markAllNotificationsAsReadService = async (
  userId: string
): Promise<boolean> => {
  const query = `
    UPDATE notifications
    SET is_read = true, updated_at = CURRENT_TIMESTAMP
    WHERE recipient_user_id = $1
  `;
  
  await pool.query(query, [userId]);
  return true;
};

/**
 * Deletes a notification
 */
export const deleteNotificationService = async (
  notificationId: string
): Promise<boolean> => {
  const query = 'DELETE FROM notifications WHERE notification_id = $1';
  const result = await pool.query(query, [notificationId]);
  
  return result.rowCount !== null && result.rowCount > 0;
};

/**
 * Gets unread notification count for a user
 */
export const getUnreadNotificationCountService = async (
  userId: string
): Promise<number> => {
  const query = `
    SELECT COUNT(*) as count
    FROM notifications
    WHERE recipient_user_id = $1 AND is_read = false
  `;
  
  const { rows } = await pool.query(query, [userId]);
  return parseInt(rows[0]?.count || '0');
};