import { FastifyInstance } from 'fastify';
import {
  createConversation,
  getConversationById,
  getUserConversations,
  updateConversation,
  addParticipantToConversation,
  removeParticipantFromConversation,
  deleteConversation,
} from './conversation.controller.js';

export const conversationRoutes = async (fastify: FastifyInstance) => {
  // Create a new conversation
  fastify.post('/', {}, createConversation);

  // Get a conversation by ID
  fastify.get('/:id', {}, getConversationById);

  // Get all conversations for a user
  fastify.get('/user/:userId', {}, getUserConversations);

  // Update a conversation
  fastify.put('/:id', {}, updateConversation);

  // Add participant to conversation
  fastify.post('/:conversationId/participants/:userId', {}, addParticipantToConversation);

  // Remove participant from conversation
  fastify.delete('/:conversationId/participants/:userId', {}, removeParticipantFromConversation);

  // Delete a conversation
  fastify.delete('/:id', {}, deleteConversation);
};