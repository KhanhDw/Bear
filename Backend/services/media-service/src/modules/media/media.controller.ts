import { FastifyRequest, FastifyReply } from 'fastify';
import {
  getMediaByIdService,
  getMediaByEntityService,
  getMediaByOwnerService,
  updateMediaService,
  deleteMediaService,
  uploadFileService,
  deleteFileFromStorageService,
} from './media.service.js';
import { UpdateMediaInput } from './media.types.js';

/* UPLOAD FILE */
export const uploadFile = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // Get file from multipart form data
    const data = await req.file();
    
    if (!data) {
      return reply.code(400).send({ message: 'No file uploaded' });
    }
    
    // Extract optional metadata from query or body
    const { ownerId, entityId, entityType } = req.body as any || req.query as any || {};
    
    const mediaFile = await uploadFileService(data, ownerId, entityId, entityType);
    reply.code(201).send(mediaFile);
  } catch (error: any) {
    console.error('Error uploading file:', error);
    reply.code(500).send({ message: 'Error uploading file', error: error.message });
  }
};

/* MULTIPLE FILES UPLOAD */
export const uploadMultipleFiles = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // Get files from multipart form data
    const files = await req.files();
    const uploadedFiles = [];
    
    for await (const file of files) {
      const { ownerId, entityId, entityType } = req.body as any || {};
      const mediaFile = await uploadFileService(file, ownerId, entityId, entityType);
      uploadedFiles.push(mediaFile);
    }
    
    reply.code(201).send(uploadedFiles);
  } catch (error: any) {
    console.error('Error uploading multiple files:', error);
    reply.code(500).send({ message: 'Error uploading files', error: error.message });
  }
};

/* READ ONE */
export const getMediaById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const mediaFile = await getMediaByIdService(req.params.id);

    if (!mediaFile) {
      return reply.code(404).send({ message: 'Media file not found' });
    }

    reply.send(mediaFile);
  } catch (error: any) {
    console.error('Error getting media by ID:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* READ ALL FOR ENTITY */
export const getMediaByEntity = async (
  req: FastifyRequest<{ Params: { entityId: string; entityType: string } }>,
  reply: FastifyReply
) => {
  try {
    const { entityId, entityType } = req.params;
    const mediaFiles = await getMediaByEntityService(entityId, entityType);
    
    reply.send(mediaFiles);
  } catch (error: any) {
    console.error('Error getting media by entity:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* READ ALL FOR OWNER */
export const getMediaByOwner = async (
  req: FastifyRequest<{ Params: { ownerId: string } }>,
  reply: FastifyReply
) => {
  try {
    const { ownerId } = req.params;
    const mediaFiles = await getMediaByOwnerService(ownerId);
    
    reply.send(mediaFiles);
  } catch (error: any) {
    console.error('Error getting media by owner:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* UPDATE */
export const updateMedia = async (
  req: FastifyRequest<{
    Params: { id: string };
    Body: UpdateMediaInput;
  }>,
  reply: FastifyReply
) => {
  try {
    const mediaFile = await updateMediaService(
      req.params.id,
      req.body
    );

    if (!mediaFile) {
      return reply.code(404).send({ message: 'Media file not found' });
    }

    reply.send(mediaFile);
  } catch (error: any) {
    console.error('Error updating media:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* DELETE */
export const deleteMedia = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const mediaFile = await getMediaByIdService(req.params.id);
    
    if (!mediaFile) {
      return reply.code(404).send({ message: 'Media file not found' });
    }

    // Delete from storage first
    const storageDeleted = await deleteFileFromStorageService(mediaFile);
    
    if (!storageDeleted) {
      console.warn('Could not delete file from storage, but proceeding with DB deletion');
    }
    
    // Then mark as deleted in DB
    const success = await deleteMediaService(req.params.id);

    if (!success) {
      return reply.code(500).send({ message: 'Failed to delete media record' });
    }

    reply.code(204).send();
  } catch (error: any) {
    console.error('Error deleting media:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};