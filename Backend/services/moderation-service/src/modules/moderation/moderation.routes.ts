import { FastifyInstance } from 'fastify';
import {
  createModerationReport,
  createModerationAction,
  createContentFilter,
  createUserBan,
  getModerationReportById,
  getModerationReportsByStatus,
  updateModerationReport,
  getContentFiltersByCategory,
  getAllContentFilters,
  checkContentForFilters,
  getActiveUserBans,
  liftUserBan,
} from './moderation.controller.js';

export const moderationRoutes = async (fastify: FastifyInstance) => {
  // Create moderation report
  fastify.post('/reports', {}, createModerationReport);

  // Create moderation action
  fastify.post('/actions', {}, createModerationAction);

  // Create content filter
  fastify.post('/filters', {}, createContentFilter);

  // Create user ban
  fastify.post('/bans', {}, createUserBan);

  // Get moderation report by ID
  fastify.get('/reports/:id', {}, getModerationReportById);

  // Get moderation reports by status
  fastify.get('/reports/status/:status', {}, getModerationReportsByStatus);

  // Update moderation report
  fastify.put('/reports/:id', {}, updateModerationReport);

  // Get content filters by category
  fastify.get('/filters/category/:category', {}, getContentFiltersByCategory);

  // Get all content filters
  fastify.get('/filters', {}, getAllContentFilters);

  // Check content for filters
  fastify.get('/filters/check', {}, checkContentForFilters);

  // Get active user bans
  fastify.get('/bans/user/:userId', {}, getActiveUserBans);

  // Lift user ban
  fastify.put('/bans/:banId/lift/:moderatorId', {}, liftUserBan);
};