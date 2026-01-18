import { z } from 'zod';

// Zod schema for creating a message
export const CreateMessageSchema = z.object({
  conversation_id: z.string().min(1, 'Conversation ID is required'),
  sender_id: z.string().min(1, 'Sender ID is required'),
  content: z.string().min(1, 'Content is required'),
  message_type: z.enum(['text', 'image', 'video', 'file', 'system']).default('text'),
});

// Zod schema for updating a message
export const UpdateMessageSchema = z.object({
  content: z.string().optional(),
});

// Zod schema for creating a conversation
export const CreateConversationSchema = z.object({
  type: z.enum(['private', 'group']),
  name: z.string().optional(),
  participant_ids: z.array(z.string()).min(1),
});

// Zod schema for updating a conversation
export const UpdateConversationSchema = z.object({
  name: z.string().optional(),
});

// Define types from schemas
export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;
export type UpdateMessageInput = z.infer<typeof UpdateMessageSchema>;
export type CreateConversationInput = z.infer<typeof CreateConversationSchema>;
export type UpdateConversationInput = z.infer<typeof UpdateConversationSchema>;

// Define the Message type
export interface Message {
  message_id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  sent_at: Date;
  updated_at: Date;
  is_edited: boolean;
  is_deleted: boolean;
}

// Define the Conversation type
export interface Conversation {
  conversation_id: string;
  type: string;
  name?: string;
  created_at: Date;
  updated_at: Date;
}

// Define the Participant type
export interface Participant {
  participant_id: number;
  conversation_id: string;
  user_id: string;
  joined_at: Date;
  left_at?: Date;
  is_active: boolean;
}