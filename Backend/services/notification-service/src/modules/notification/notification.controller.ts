import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createNotificationService,
  getUserNotificationsService,
  getNotificationByIdService,
  updateNotificationService,
  markAllNotificationsAsReadService,
  deleteNotificationService,
  getUnreadNotificationCountService,
} from './notification.service.js';
import { CreateNotificationInput, UpdateNotificationInput } from './notification.types.js';

/* CREATE */
export const createNotification = async (
  req: FastifyRequest<{ Body: CreateNotificationInput }>,
  reply: FastifyReply
) => {
  try {
    const notification = await createNotificationService(req.body);
    reply.code(201).send(notification);
  } catch (error: any) {
    console.error('Error creating notification:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* READ ALL FOR USER */
export const getUserNotifications = async (
  req: FastifyRequest<{
    Querystring: {
      isRead?: string;
      limit?: string;
      offset?: string;
    };
    Params: { userId: string };
  }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = req.params;
    const { isRead, limit = '20', offset = '0' } = req.query;
    
    const isReadBool = isRead !== undefined ? isRead === 'true' : undefined;
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);
    
    const notifications = await getUserNotificationsService(
      userId,
      isReadBool,
      limitNum,
      offsetNum
    );
    
    reply.send(notifications);
  } catch (error: any) {
    console.error('Error getting user notifications:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* READ ONE */
export const getNotificationById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const notification = await getNotificationByIdService(req.params.id);

    if (!notification) {
      return reply.code(404).send({ message: 'Notification not found' });
    }

    reply.send(notification);
  } catch (error: any) {
    console.error('Error getting notification by ID:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* UPDATE */
export const updateNotification = async (
  req: FastifyRequest<{
    Params: { id: string };
    Body: UpdateNotificationInput;
  }>,
  reply: FastifyReply
) => {
  try {
    const notification = await updateNotificationService(
      req.params.id,
      req.body
    );

    if (!notification) {
      return reply.code(404).send({ message: 'Notification not found' });
    }

    reply.send(notification);
  } catch (error: any) {
    console.error('Error updating notification:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* MARK ALL AS READ */
export const markAllNotificationsAsRead = async (
  req: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = req.params;
    const success = await markAllNotificationsAsReadService(userId);

    if (!success) {
      return reply.code(500).send({ message: 'Failed to mark notifications as read' });
    }

    reply.send({ message: 'All notifications marked as read' });
  } catch (error: any) {
    console.error('Error marking all notifications as read:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* GET UNREAD COUNT */
export const getUnreadNotificationCount = async (
  req: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = req.params;
    const count = await getUnreadNotificationCountService(userId);

    reply.send({ count });
  } catch (error: any) {
    console.error('Error getting unread notification count:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* DELETE */
export const deleteNotification = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const success = await deleteNotificationService(req.params.id);

    if (!success) {
      return reply.code(404).send({ message: 'Notification not found' });
    }

    reply.code(204).send();
  } catch (error: any) {
    console.error('Error deleting notification:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};