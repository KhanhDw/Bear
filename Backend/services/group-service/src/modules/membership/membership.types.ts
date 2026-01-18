import { z } from 'zod';

// Zod schema for creating a group membership
export const CreateMembershipSchema = z.object({
  group_id: z.string().min(1, 'Group ID is required'),
  user_id: z.string().min(1, 'User ID is required'),
  role: z.enum(['admin', 'moderator', 'member', 'banned']).default('member'),
});

// Zod schema for updating a group membership
export const UpdateMembershipSchema = z.object({
  role: z.enum(['admin', 'moderator', 'member', 'banned']).optional(),
  is_active: z.boolean().optional(),
});

// Define types from schemas
export type CreateMembershipInput = z.infer<typeof CreateMembershipSchema>;
export type UpdateMembershipInput = z.infer<typeof UpdateMembershipSchema>;

// Define the GroupMember type
export interface GroupMember {
  membership_id: string;
  group_id: string;
  user_id: string;
  role: string;
  joined_at: Date;
  left_at?: Date;
  is_active: boolean;
}