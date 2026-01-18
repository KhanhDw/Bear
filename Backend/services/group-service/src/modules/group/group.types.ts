import { z } from 'zod';

// Zod schema for creating a group
export const CreateGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required').max(255),
  description: z.string().optional(),
  creator_id: z.string().min(1, 'Creator ID is required'),
  privacy_level: z.enum(['public', 'private', 'hidden']).default('public'),
  avatar_url: z.string().url().optional(),
  cover_image_url: z.string().url().optional(),
});

// Zod schema for updating a group
export const UpdateGroupSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  privacy_level: z.enum(['public', 'private', 'hidden']).optional(),
  avatar_url: z.string().url().optional(),
  cover_image_url: z.string().url().optional(),
  is_active: z.boolean().optional(),
});

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
export type CreateGroupInput = z.infer<typeof CreateGroupSchema>;
export type UpdateGroupInput = z.infer<typeof UpdateGroupSchema>;
export type CreateMembershipInput = z.infer<typeof CreateMembershipSchema>;
export type UpdateMembershipInput = z.infer<typeof UpdateMembershipSchema>;

// Define the Group type
export interface Group {
  group_id: string;
  name: string;
  description?: string;
  creator_id: string;
  privacy_level: string;
  member_count: number;
  avatar_url?: string;
  cover_image_url?: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

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