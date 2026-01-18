import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createUserAnalyticsService,
  createContentAnalyticsService,
  createSystemAnalyticsService,
  createUserEngagementService,
  getUserAnalyticsService,
  getContentAnalyticsService,
  getSystemAnalyticsService,
  getUserEngagementService,
  getUserStatsService,
  getDailyActiveUsersService,
  getWeeklyActiveUsersService,
  getMonthlyActiveUsersService,
} from './analytics.service.js';
import { 
  CreateUserAnalyticsInput, 
  CreateContentAnalyticsInput,
  CreateSystemAnalyticsInput,
  CreateUserEngagementInput
} from './analytics.types.js';
import moment from 'moment';

/* CREATE USER ANALYTICS */
export const createUserAnalytics = async (
  req: FastifyRequest<{ Body: CreateUserAnalyticsInput }>,
  reply: FastifyReply
) => {
  try {
    const analytics = await createUserAnalyticsService(req.body);
    reply.code(201).send(analytics);
  } catch (error: any) {
    console.error('Error creating user analytics:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* CREATE CONTENT ANALYTICS */
export const createContentAnalytics = async (
  req: FastifyRequest<{ Body: CreateContentAnalyticsInput }>,
  reply: FastifyReply
) => {
  try {
    const analytics = await createContentAnalyticsService(req.body);
    reply.code(201).send(analytics);
  } catch (error: any) {
    console.error('Error creating content analytics:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* CREATE SYSTEM ANALYTICS */
export const createSystemAnalytics = async (
  req: FastifyRequest<{ Body: CreateSystemAnalyticsInput }>,
  reply: FastifyReply
) => {
  try {
    const analytics = await createSystemAnalyticsService(req.body);
    reply.code(201).send(analytics);
  } catch (error: any) {
    console.error('Error creating system analytics:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* CREATE USER ENGAGEMENT */
export const createUserEngagement = async (
  req: FastifyRequest<{ Body: CreateUserEngagementInput }>,
  reply: FastifyReply
) => {
  try {
    const engagement = await createUserEngagementService(req.body);
    reply.code(201).send(engagement);
  } catch (error: any) {
    console.error('Error creating user engagement:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* GET USER ANALYTICS */
export const getUserAnalytics = async (
  req: FastifyRequest<{
    Params: { userId: string };
    Querystring: {
      metricType?: string;
      startDate?: string;
      endDate?: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = req.params;
    const { metricType, startDate, endDate } = req.query;
    
    const analytics = await getUserAnalyticsService(userId, metricType, startDate, endDate);
    
    reply.send(analytics);
  } catch (error: any) {
    console.error('Error getting user analytics:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* GET CONTENT ANALYTICS */
export const getContentAnalytics = async (
  req: FastifyRequest<{
    Params: { contentId: string };
    Querystring: {
      metricType?: string;
      startDate?: string;
      endDate?: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { contentId } = req.params;
    const { metricType, startDate, endDate } = req.query;
    
    const analytics = await getContentAnalyticsService(contentId, metricType, startDate, endDate);
    
    reply.send(analytics);
  } catch (error: any) {
    console.error('Error getting content analytics:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* GET SYSTEM ANALYTICS */
export const getSystemAnalytics = async (
  req: FastifyRequest<{
    Querystring: {
      metricName?: string;
      startDate?: string;
      endDate?: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { metricName, startDate, endDate } = req.query;
    
    const analytics = await getSystemAnalyticsService(metricName, startDate, endDate);
    
    reply.send(analytics);
  } catch (error: any) {
    console.error('Error getting system analytics:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* GET USER ENGAGEMENT */
export const getUserEngagement = async (
  req: FastifyRequest<{
    Params: { userId: string };
    Querystring: {
      actionType?: string;
      startDate?: string;
      endDate?: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = req.params;
    const { actionType, startDate, endDate } = req.query;
    
    const engagement = await getUserEngagementService(userId, actionType, startDate, endDate);
    
    reply.send(engagement);
  } catch (error: any) {
    console.error('Error getting user engagement:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* GET USER STATS */
export const getUserStats = async (
  req: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = req.params;
    const stats = await getUserStatsService(userId);
    
    if (!stats) {
      return reply.code(404).send({ message: 'User stats not found' });
    }
    
    reply.send(stats);
  } catch (error: any) {
    console.error('Error getting user stats:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* GET DAILY ACTIVE USERS */
export const getDailyActiveUsers = async (
  req: FastifyRequest<{
    Querystring: {
      date?: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { date = moment().format('YYYY-MM-DD') } = req.query;
    const dau = await getDailyActiveUsersService(date);
    
    reply.send({ date, dau });
  } catch (error: any) {
    console.error('Error getting daily active users:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* GET WEEKLY ACTIVE USERS */
export const getWeeklyActiveUsers = async (
  req: FastifyRequest<{
    Querystring: {
      date?: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { date = moment().format('YYYY-MM-DD') } = req.query;
    const wau = await getWeeklyActiveUsersService(date);
    
    reply.send({ date, wau });
  } catch (error: any) {
    console.error('Error getting weekly active users:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* GET MONTHLY ACTIVE USERS */
export const getMonthlyActiveUsers = async (
  req: FastifyRequest<{
    Querystring: {
      date?: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { date = moment().format('YYYY-MM-DD') } = req.query;
    const mau = await getMonthlyActiveUsersService(date);
    
    reply.send({ date, mau });
  } catch (error: any) {
    console.error('Error getting monthly active users:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};