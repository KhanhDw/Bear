import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createMessageService,
  getMessagesByConversationService,
  getMessageByIdService,
  updateMessageService,
  deleteMessageService,
  getRecentMessagesForUserService,
} from './message.service.js';
import { CreateMessageInput, UpdateMessageInput } from './message.types.js';

/* CREATE */
export const createMessage = async (
  req: FastifyRequest<{ Body: CreateMessageInput }>,
  reply: FastifyReply
) => {
  try {
    const message = await createMessageService(req.body);
    reply.code(201).send(message);
  } catch (error: any) {
    console.error('Error creating message:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* READ ALL FOR CONVERSATION */
export const getMessagesByConversation = async (
  req: FastifyRequest<{
    Querystring: {
      limit?: string;
      offset?: string;
    };
    Params: { conversationId: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { conversationId } = req.params;
    const { limit = '50', offset = '0' } = req.query;
    
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);
    
    const messages = await getMessagesByConversationService(
      conversationId,
      limitNum,
      offsetNum
    );
    
    reply.send(messages);
  } catch (error: any) {
    console.error('Error getting messages by conversation:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* READ ONE */
export const getMessageById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const message = await getMessageByIdService(req.params.id);

    if (!message) {
      return reply.code(404).send({ message: 'Message not found' });
    }

    reply.send(message);
  } catch (error: any) {
    console.error('Error getting message by ID:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* UPDATE */
export const updateMessage = async (
  req: FastifyRequest<{
    Params: { id: string };
    Body: UpdateMessageInput;
  }>,
  reply: FastifyReply
) => {
  try {
    const message = await updateMessageService(
      req.params.id,
      req.body
    );

    if (!message) {
      return reply.code(404).send({ message: 'Message not found' });
    }

    reply.send(message);
  } catch (error: any) {
    console.error('Error updating message:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* DELETE */
export const deleteMessage = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const success = await deleteMessageService(req.params.id);

    if (!success) {
      return reply.code(404).send({ message: 'Message not found' });
    }

    reply.code(204).send();
  } catch (error: any) {
    console.error('Error deleting message:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* GET RECENT MESSAGES FOR USER */
export const getRecentMessagesForUser = async (
  req: FastifyRequest<{
    Querystring: {
      limit?: string;
    };
    Params: { userId: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = req.params;
    const { limit = '20' } = req.query;
    
    const limitNum = parseInt(limit);
    
    const messages = await getRecentMessagesForUserService(
      userId,
      limitNum
    );
    
    reply.send(messages);
  } catch (error: any) {
    console.error('Error getting recent messages for user:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};