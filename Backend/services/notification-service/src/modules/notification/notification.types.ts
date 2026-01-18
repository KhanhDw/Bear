import { z } from 'zod';

// Zod schema for creating a notification
export const CreateNotificationSchema = z.object({
  recipient_user_id: z.string().min(1, 'Recipient user ID is required'),
  sender_user_id: z.string().optional(),
  type: z.enum([
    'like',
    'comment',
    'follow',
    'mention',
    'message',
    'share',
    'reply',
    'tag',
    'system'
  ]),
  title: z.string().min(1, 'Title is required').max(255),
  content: z.string().optional(),
  entity_id: z.string().optional(),
  entity_type: z.enum(['post', 'comment', 'user', 'group']).optional(),
});

// Zod schema for updating a notification
export const UpdateNotificationSchema = z.object({
  is_read: z.boolean().optional(),
});

// Define types from schemas
export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;
export type UpdateNotificationInput = z.infer<typeof UpdateNotificationSchema>;

// Define the Notification type
export interface Notification {
  notification_id: string;
  recipient_user_id: string;
  sender_user_id?: string;
  type: string;
  title: string;
  content?: string;
  entity_id?: string;
  entity_type?: string;
  is_read: boolean;
  created_at: Date;
  updated_at: Date;
}