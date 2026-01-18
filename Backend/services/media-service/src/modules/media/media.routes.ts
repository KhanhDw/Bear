import { FastifyInstance } from 'fastify';
import {
  uploadFile,
  uploadMultipleFiles,
  getMediaById,
  getMediaByEntity,
  getMediaByOwner,
  updateMedia,
  deleteMedia,
} from './media.controller.js';

export const mediaRoutes = async (fastify: FastifyInstance) => {
  // Upload a single file
  fastify.post('/upload', { 
    preHandler: (req, reply, done) => {
      // Set limits for file uploads
      req.multipart({}, (err) => {
        if (err) {
          reply.send(err);
          return;
        }
        done();
      });
    }
  }, uploadFile);

  // Upload multiple files
  fastify.post('/upload-multiple', { 
    preHandler: (req, reply, done) => {
      // Set limits for file uploads
      req.multipart((field, file, filename, encoding, mimetype) => {
        // Handle multiple files
        return file;
      }, (err) => {
        if (err) {
          reply.send(err);
          return;
        }
      });
      done();
    }
  }, uploadMultipleFiles);

  // Get a media file by ID
  fastify.get('/:id', {}, getMediaById);

  // Get all media files for an entity
  fastify.get('/entity/:entityId/type/:entityType', {}, getMediaByEntity);

  // Get all media files for an owner
  fastify.get('/owner/:ownerId', {}, getMediaByOwner);

  // Update a media file
  fastify.put('/:id', {}, updateMedia);

  // Delete a media file
  fastify.delete('/:id', {}, deleteMedia);
};