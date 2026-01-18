import { z } from 'zod';
import { Participant } from '../message/message.types.js';

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
export type CreateConversationInput = z.infer<typeof CreateConversationSchema>;
export type UpdateConversationInput = z.infer<typeof UpdateConversationSchema>;

// Define the Conversation type
export interface Conversation {
  conversation_id: string;
  type: string;
  name?: string;
  created_at: Date;
  updated_at: Date;
}

// Export Participant type from message types
export type { Participant };