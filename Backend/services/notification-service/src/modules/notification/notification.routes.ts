import { FastifyInstance, FastifyRequest } from 'fastify';
import {
  createNotification,
  getUserNotifications,
  getNotificationById,
  updateNotification,
  markAllNotificationsAsRead,
  getUnreadNotificationCount,
  deleteNotification,
} from './notification.controller.js';

export const notificationRoutes = async (fastify: FastifyInstance) => {
  // Create a new notification
  fastify.post('/', {}, createNotification);

  // Get all notifications for a user
  fastify.get('/user/:userId', {}, async (req: FastifyRequest<{ 
    Querystring: { 
      isRead?: string; 
      limit?: string; 
      offset?: string; 
    }; 
    Params: { userId: string } 
  }>, reply) => {
    return getUserNotifications(req, reply);
  });

  // Get a notification by ID
  fastify.get('/:id', {}, getNotificationById);

  // Update a notification (mark as read/unread)
  fastify.put('/:id', {}, updateNotification);

  // Mark all notifications as read for a user
  fastify.put('/mark-all-read/:userId', {}, markAllNotificationsAsRead);

  // Get unread notification count for a user
  fastify.get('/unread-count/:userId', {}, getUnreadNotificationCount);

  // Delete a notification
  fastify.delete('/:id', {}, deleteNotification);
};