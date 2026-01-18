import { FastifyInstance, FastifyRequest } from 'fastify';
import {
  createMessage,
  getMessagesByConversation,
  getMessageById,
  updateMessage,
  deleteMessage,
  getRecentMessagesForUser,
} from './message.controller.js';

export const messageRoutes = async (fastify: FastifyInstance) => {
  // Create a new message
  fastify.post('/', {}, createMessage);

  // Get all messages for a conversation
  fastify.get('/conversation/:conversationId', {}, async (req: FastifyRequest<{ 
    Querystring: { 
      limit?: string; 
      offset?: string; 
    }; 
    Params: { conversationId: string } 
  }>, reply) => {
    return getMessagesByConversation(req, reply);
  });

  // Get a message by ID
  fastify.get('/:id', {}, getMessageById);

  // Update a message
  fastify.put('/:id', {}, updateMessage);

  // Delete a message
  fastify.delete('/:id', {}, deleteMessage);

  // Get recent messages for a user
  fastify.get('/recent/:userId', {}, async (req: FastifyRequest<{ 
    Querystring: { 
      limit?: string; 
    }; 
    Params: { userId: string } 
  }>, reply) => {
    return getRecentMessagesForUser(req, reply);
  });
};