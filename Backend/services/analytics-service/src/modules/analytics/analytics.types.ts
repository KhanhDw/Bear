import { z } from 'zod';

// Zod schema for creating a user analytics record
export const CreateUserAnalyticsSchema = z.object({
  user_id: z.string().min(1, 'User ID is required'),
  metric_type: z.string().min(1, 'Metric type is required'),
  value: z.number().int().positive().default(1),
  date_recorded: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // YYYY-MM-DD format
});

// Zod schema for creating a content analytics record
export const CreateContentAnalyticsSchema = z.object({
  content_id: z.string().min(1, 'Content ID is required'),
  content_type: z.enum(['post', 'comment', 'media']),
  metric_type: z.string().min(1, 'Metric type is required'),
  value: z.number().int().positive().default(1),
  date_recorded: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // YYYY-MM-DD format
});

// Zod schema for creating a system analytics record
export const CreateSystemAnalyticsSchema = z.object({
  metric_name: z.string().min(1, 'Metric name is required'),
  metric_value: z.number().positive(),
  date_recorded: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // YYYY-MM-DD format
});

// Zod schema for creating a user engagement record
export const CreateUserEngagementSchema = z.object({
  user_id: z.string().min(1, 'User ID is required'),
  engaged_with_user_id: z.string().optional(),
  content_id: z.string().optional(),
  content_type: z.enum(['post', 'comment', 'user_profile', 'group']).optional(),
  action_type: z.string().min(1, 'Action type is required'),
  duration_seconds: z.number().int().nonnegative().optional(),
});

// Define types from schemas
export type CreateUserAnalyticsInput = z.infer<typeof CreateUserAnalyticsSchema>;
export type CreateContentAnalyticsInput = z.infer<typeof CreateContentAnalyticsSchema>;
export type CreateSystemAnalyticsInput = z.infer<typeof CreateSystemAnalyticsSchema>;
export type CreateUserEngagementInput = z.infer<typeof CreateUserEngagementSchema>;

// Define the Analytics types
export interface UserAnalytics {
  analytics_id: string;
  user_id: string;
  metric_type: string;
  value: number;
  date_recorded: Date;
  created_at: Date;
}

export interface ContentAnalytics {
  analytics_id: string;
  content_id: string;
  content_type: string;
  metric_type: string;
  value: number;
  date_recorded: Date;
  created_at: Date;
}

export interface SystemAnalytics {
  analytics_id: string;
  metric_name: string;
  metric_value: number;
  date_recorded: Date;
  created_at: Date;
}

export interface UserEngagement {
  engagement_id: string;
  user_id: string;
  engaged_with_user_id?: string;
  content_id?: string;
  content_type?: string;
  action_type: string;
  duration_seconds?: number;
  created_at: Date;
}