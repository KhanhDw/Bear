import { z } from 'zod';

// Zod schema for creating a media file record
export const CreateMediaSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  original_filename: z.string().min(1, 'Original filename is required'),
  mime_type: z.string().min(1, 'MIME type is required'),
  file_size: z.number().positive('File size must be positive'),
  file_path: z.string().min(1, 'File path is required'),
  file_url: z.string().url('File URL must be a valid URL'),
  entity_id: z.string().optional(),
  entity_type: z.enum(['post', 'comment', 'profile', 'cover', 'message', 'story']).optional(),
  owner_id: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Zod schema for updating a media file
export const UpdateMediaSchema = z.object({
  entity_id: z.string().optional(),
  entity_type: z.enum(['post', 'comment', 'profile', 'cover', 'message', 'story']).optional(),
});

// Define types from schemas
export type CreateMediaInput = z.infer<typeof CreateMediaSchema>;
export type UpdateMediaInput = z.infer<typeof UpdateMediaSchema>;

// Define the MediaFile type
export interface MediaFile {
  media_id: string;
  filename: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  file_path: string;
  file_url: string;
  entity_id?: string;
  entity_type?: string;
  owner_id?: string;
  upload_date: Date;
  updated_at: Date;
  is_deleted: boolean;
  metadata?: Record<string, unknown>;
}

// Define file upload type
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}