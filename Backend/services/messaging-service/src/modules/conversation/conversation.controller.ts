import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createConversationService,
  getConversationByIdService,
  getUserConversationsService,
  updateConversationService,
  addParticipantToConversationService,
  removeParticipantFromConversationService,
  deleteConversationService,
} from './conversation.service.js';
import { CreateConversationInput, UpdateConversationInput } from './conversation.types.js';

/* CREATE */
export const createConversation = async (
  req: FastifyRequest<{ Body: CreateConversationInput }>,
  reply: FastifyReply
) => {
  try {
    const conversation = await createConversationService(req.body);
    reply.code(201).send(conversation);
  } catch (error: any) {
    console.error('Error creating conversation:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* READ ONE */
export const getConversationById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const conversation = await getConversationByIdService(req.params.id);

    if (!conversation) {
      return reply.code(404).send({ message: 'Conversation not found' });
    }

    reply.send(conversation);
  } catch (error: any) {
    console.error('Error getting conversation by ID:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* READ ALL FOR USER */
export const getUserConversations = async (
  req: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = req.params;
    const conversations = await getUserConversationsService(userId);
    
    reply.send(conversations);
  } catch (error: any) {
    console.error('Error getting user conversations:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* UPDATE */
export const updateConversation = async (
  req: FastifyRequest<{
    Params: { id: string };
    Body: UpdateConversationInput;
  }>,
  reply: FastifyReply
) => {
  try {
    const conversation = await updateConversationService(
      req.params.id,
      req.body
    );

    if (!conversation) {
      return reply.code(404).send({ message: 'Conversation not found' });
    }

    reply.send(conversation);
  } catch (error: any) {
    console.error('Error updating conversation:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* ADD PARTICIPANT */
export const addParticipantToConversation = async (
  req: FastifyRequest<{
    Params: { conversationId: string; userId: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { conversationId, userId } = req.params;
    const success = await addParticipantToConversationService(conversationId, userId);

    if (!success) {
      return reply.code(500).send({ message: 'Failed to add participant to conversation' });
    }

    reply.send({ message: 'Participant added to conversation' });
  } catch (error: any) {
    console.error('Error adding participant to conversation:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* REMOVE PARTICIPANT */
export const removeParticipantFromConversation = async (
  req: FastifyRequest<{
    Params: { conversationId: string; userId: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { conversationId, userId } = req.params;
    const success = await removeParticipantFromConversationService(conversationId, userId);

    if (!success) {
      return reply.code(500).send({ message: 'Failed to remove participant from conversation' });
    }

    reply.send({ message: 'Participant removed from conversation' });
  } catch (error: any) {
    console.error('Error removing participant from conversation:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* DELETE */
export const deleteConversation = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const success = await deleteConversationService(req.params.id);

    if (!success) {
      return reply.code(404).send({ message: 'Conversation not found' });
    }

    reply.code(204).send();
  } catch (error: any) {
    console.error('Error deleting conversation:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};