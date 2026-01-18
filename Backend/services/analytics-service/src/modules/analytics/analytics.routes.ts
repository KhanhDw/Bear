import { FastifyInstance } from 'fastify';
import {
  createUserAnalytics,
  createContentAnalytics,
  createSystemAnalytics,
  createUserEngagement,
  getUserAnalytics,
  getContentAnalytics,
  getSystemAnalytics,
  getUserEngagement,
  getUserStats,
  getDailyActiveUsers,
  getWeeklyActiveUsers,
  getMonthlyActiveUsers,
} from './analytics.controller.js';

export const analyticsRoutes = async (fastify: FastifyInstance) => {
  // Create user analytics
  fastify.post('/user', {}, createUserAnalytics);

  // Create content analytics
  fastify.post('/content', {}, createContentAnalytics);

  // Create system analytics
  fastify.post('/system', {}, createSystemAnalytics);

  // Create user engagement
  fastify.post('/engagement', {}, createUserEngagement);

  // Get user analytics
  fastify.get('/user/:userId', {}, getUserAnalytics);

  // Get content analytics
  fastify.get('/content/:contentId', {}, getContentAnalytics);

  // Get system analytics
  fastify.get('/system', {}, getSystemAnalytics);

  // Get user engagement
  fastify.get('/engagement/:userId', {}, getUserEngagement);

  // Get user stats
  fastify.get('/user-stats/:userId', {}, getUserStats);

  // Get daily active users
  fastify.get('/dau', {}, getDailyActiveUsers);

  // Get weekly active users
  fastify.get('/wau', {}, getWeeklyActiveUsers);

  // Get monthly active users
  fastify.get('/mau', {}, getMonthlyActiveUsers);
};