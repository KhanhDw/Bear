import { Pool } from 'pg';
import { env } from '../../config/env.js';
import { 
  CreateMediaInput, 
  UpdateMediaInput,
  MediaFile 
} from './media.types.js';
import fs from 'fs/promises';
import path from 'path';
import aws from 'aws-sdk';
import sharp from 'sharp';

// Initialize database connection pool
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

// Initialize AWS S3
const s3 = new aws.S3({
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  region: env.AWS_REGION,
});

/**
 * Creates a new media file record
 */
export const createMediaService = async (
  input: CreateMediaInput
): Promise<MediaFile> => {
  const {
    filename,
    original_filename,
    mime_type,
    file_size,
    file_path,
    file_url,
    entity_id,
    entity_type,
    owner_id,
    metadata,
  } = input;

  const query = `
    INSERT INTO media_files (
      media_id,
      filename,
      original_filename,
      mime_type,
      file_size,
      file_path,
      file_url,
      entity_id,
      entity_type,
      owner_id,
      metadata
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *
  `;

  const values = [
    crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    filename,
    original_filename,
    mime_type,
    file_size,
    file_path,
    file_url,
    entity_id || null,
    entity_type || null,
    owner_id || null,
    metadata || null,
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

/**
 * Gets a media file by ID
 */
export const getMediaByIdService = async (
  mediaId: string
): Promise<MediaFile | null> => {
  const query = 'SELECT * FROM media_files WHERE media_id = $1 AND is_deleted = false';
  const { rows } = await pool.query(query, [mediaId]);

  return rows.length ? rows[0] : null;
};

/**
 * Gets all media files for a specific entity
 */
export const getMediaByEntityService = async (
  entityId: string,
  entityType: string
): Promise<MediaFile[]> => {
  const query = `
    SELECT * FROM media_files 
    WHERE entity_id = $1 AND entity_type = $2 AND is_deleted = false
    ORDER BY upload_date DESC
  `;
  const params = [entityId, entityType];

  const { rows } = await pool.query(query, params);
  return rows;
};

/**
 * Gets all media files for a specific user
 */
export const getMediaByOwnerService = async (
  ownerId: string
): Promise<MediaFile[]> => {
  const query = `
    SELECT * FROM media_files 
    WHERE owner_id = $1 AND is_deleted = false
    ORDER BY upload_date DESC
  `;
  const params = [ownerId];

  const { rows } = await pool.query(query, params);
  return rows;
};

/**
 * Updates a media file record
 */
export const updateMediaService = async (
  mediaId: string,
  input: UpdateMediaInput
): Promise<MediaFile | null> => {
  const { entity_id, entity_type } = input;
  
  const query = `
    UPDATE media_files
    SET entity_id = $1, entity_type = $2, updated_at = CURRENT_TIMESTAMP
    WHERE media_id = $3 AND is_deleted = false
    RETURNING *
  `;
  
  const { rows } = await pool.query(query, [entity_id || null, entity_type || null, mediaId]);
  return rows.length ? rows[0] : null;
};

/**
 * Soft deletes a media file
 */
export const deleteMediaService = async (
  mediaId: string
): Promise<boolean> => {
  const query = `
    UPDATE media_files
    SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
    WHERE media_id = $1
    RETURNING media_id
  `;
  
  const { rows } = await pool.query(query, [mediaId]);
  return rows.length > 0;
};

/**
 * Uploads a file to storage (local or S3)
 */
export const uploadFileService = async (
  file: any, // Express file object from multipart
  ownerId?: string,
  entityId?: string,
  entityType?: string
): Promise<MediaFile> => {
  try {
    // Process image if it's an image file
    let processedBuffer: Buffer | null = null;
    let metadata: Record<string, unknown> = {};
    
    if (file.mimetype.startsWith('image/')) {
      // Resize and optimize image
      const image = sharp(file.buffer);
      const imageMetadata = await image.metadata();
      
      // Store original dimensions
      metadata = {
        width: imageMetadata.width,
        height: imageMetadata.height,
        format: imageMetadata.format,
      };
      
      // Resize if too large
      if ((imageMetadata.width && imageMetadata.width > 2048) || 
          (imageMetadata.height && imageMetadata.height > 2048)) {
        processedBuffer = await image.resize(2048, 2048, {
          fit: 'inside',
          withoutEnlargement: true
        }).jpeg({ quality: 85 }).toBuffer();
      } else {
        processedBuffer = file.buffer;
      }
    } else {
      // For non-image files, use original buffer
      processedBuffer = file.buffer;
    }
    
    // Determine if we're using S3 or local storage
    let fileUrl: string;
    let filePath: string;
    
    if (env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY) {
      // Upload to S3
      const key = `media/${ownerId}/${crypto.randomUUID?.() || Date.now()}-${file.originalname}`;
      
      const uploadParams = {
        Bucket: env.S3_BUCKET_NAME,
        Key: key,
        Body: processedBuffer,
        ContentType: file.mimetype,
        Metadata: {
          ownerId: ownerId || '',
          entityId: entityId || '',
          entityType: entityType || ''
        }
      };
      
      const result = await s3.upload(uploadParams).promise();
      fileUrl = result.Location;
      filePath = result.Key;
    } else {
      // Save locally
      const uploadDir = env.UPLOAD_DIR;
      await fs.mkdir(uploadDir, { recursive: true });
      
      const fileName = `${crypto.randomUUID?.() || Date.now()}-${file.originalname}`;
      const fullPath = path.join(uploadDir, fileName);
      
      await fs.writeFile(fullPath, processedBuffer);
      
      fileUrl = `${process.env.API_BASE_URL || 'http://localhost:3008'}/uploads/${fileName}`;
      filePath = fullPath;
    }
    
    // Create media record in database
    const mediaRecord: CreateMediaInput = {
      filename: path.basename(filePath),
      original_filename: file.originalname,
      mime_type: file.mimetype,
      file_size: processedBuffer.length,
      file_path: filePath,
      file_url: fileUrl,
      owner_id: ownerId,
      entity_id: entityId,
      entity_type: entityType,
      metadata
    };
    
    return await createMediaService(mediaRecord);
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Deletes a file from storage (local or S3)
 */
export const deleteFileFromStorageService = async (
  mediaFile: MediaFile
): Promise<boolean> => {
  try {
    if (mediaFile.file_path.startsWith('media/')) {
      // This is an S3 file, delete from S3
      await s3.deleteObject({
        Bucket: env.S3_BUCKET_NAME,
        Key: mediaFile.file_path
      }).promise();
    } else {
      // This is a local file, delete from local storage
      await fs.unlink(mediaFile.file_path);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting file from storage:', error);
    return false;
  }
};