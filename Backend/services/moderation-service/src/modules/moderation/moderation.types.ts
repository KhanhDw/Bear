import { z } from 'zod';

// Zod schema for creating a moderation report
export const CreateModerationReportSchema = z.object({
  reporter_user_id: z.string().min(1, 'Reporter user ID is required'),
  reported_user_id: z.string().optional(),
  content_id: z.string().optional(),
  content_type: z.enum(['post', 'comment', 'profile', 'message', 'group']).optional(),
  content_text: z.string().optional(),
  reason: z.string().min(1, 'Reason is required').max(100),
  description: z.string().optional(),
  severity_level: z.number().int().min(1).max(5).optional(),
});

// Zod schema for updating a moderation report
export const UpdateModerationReportSchema = z.object({
  status: z.enum(['pending', 'reviewed', 'approved', 'rejected', 'escalated']).optional(),
  assigned_moderator_id: z.string().optional(),
  resolution_notes: z.string().optional(),
});

// Zod schema for creating a moderation action
export const CreateModerationActionSchema = z.object({
  moderator_id: z.string().min(1, 'Moderator ID is required'),
  target_user_id: z.string().optional(),
  target_content_id: z.string().optional(),
  action_type: z.enum(['warn', 'suspend', 'ban', 'delete_content', 'remove_from_group', 'mute']),
  reason: z.string().optional(),
  duration_minutes: z.number().int().positive().optional(),
});

// Zod schema for creating a content filter
export const CreateContentFilterSchema = z.object({
  keyword: z.string().min(1, 'Keyword is required').max(255),
  category: z.string().min(1, 'Category is required').max(50),
  severity_level: z.number().int().min(1).max(5),
  is_active: z.boolean().optional(),
});

// Zod schema for creating a user ban
export const CreateUserBanSchema = z.object({
  user_id: z.string().min(1, 'User ID is required'),
  moderator_id: z.string().min(1, 'Moderator ID is required'),
  reason: z.string().optional(),
  ban_type: z.enum(['temporary', 'permanent']).default('temporary'),
  expires_at: z.string().datetime().optional(), // ISO string
});

// Define types from schemas
export type CreateModerationReportInput = z.infer<typeof CreateModerationReportSchema>;
export type UpdateModerationReportInput = z.infer<typeof UpdateModerationReportSchema>;
export type CreateModerationActionInput = z.infer<typeof CreateModerationActionSchema>;
export type CreateContentFilterInput = z.infer<typeof CreateContentFilterSchema>;
export type CreateUserBanInput = z.infer<typeof CreateUserBanSchema>;

// Define the Moderation Report type
export interface ModerationReport {
  report_id: string;
  reporter_user_id: string;
  reported_user_id?: string;
  content_id?: string;
  content_type?: string;
  content_text?: string;
  reason: string;
  description?: string;
  status: string;
  severity_level: number;
  assigned_moderator_id?: string;
  resolution_notes?: string;
  created_at: Date;
  updated_at: Date;
  resolved_at?: Date;
}

// Define the Moderation Action type
export interface ModerationAction {
  action_id: string;
  moderator_id: string;
  target_user_id?: string;
  target_content_id?: string;
  action_type: string;
  reason?: string;
  duration_minutes?: number;
  created_at: Date;
}

// Define the Content Filter type
export interface ContentFilter {
  filter_id: string;
  keyword: string;
  category: string;
  severity_level: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Define the User Ban type
export interface UserBan {
  ban_id: string;
  user_id: string;
  moderator_id: string;
  reason?: string;
  ban_type: string;
  expires_at?: Date;
  created_at: Date;
  lifted_at?: Date;
  lifted_by_moderator_id?: string;
}