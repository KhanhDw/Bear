import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createModerationReportService,
  createModerationActionService,
  createContentFilterService,
  createUserBanService,
  getModerationReportByIdService,
  getModerationReportsByStatusService,
  updateModerationReportService,
  getContentFiltersByCategoryService,
  getAllContentFiltersService,
  checkContentForFiltersService,
  getActiveUserBansService,
  liftUserBanService,
} from './moderation.service.js';
import { 
  CreateModerationReportInput, 
  UpdateModerationReportInput,
  CreateModerationActionInput,
  CreateContentFilterInput,
  CreateUserBanInput
} from './moderation.types.js';

/* CREATE MODERATION REPORT */
export const createModerationReport = async (
  req: FastifyRequest<{ Body: CreateModerationReportInput }>,
  reply: FastifyReply
) => {
  try {
    const report = await createModerationReportService(req.body);
    reply.code(201).send(report);
  } catch (error: any) {
    console.error('Error creating moderation report:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* CREATE MODERATION ACTION */
export const createModerationAction = async (
  req: FastifyRequest<{ Body: CreateModerationActionInput }>,
  reply: FastifyReply
) => {
  try {
    const action = await createModerationActionService(req.body);
    reply.code(201).send(action);
  } catch (error: any) {
    console.error('Error creating moderation action:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* CREATE CONTENT FILTER */
export const createContentFilter = async (
  req: FastifyRequest<{ Body: CreateContentFilterInput }>,
  reply: FastifyReply
) => {
  try {
    const filter = await createContentFilterService(req.body);
    reply.code(201).send(filter);
  } catch (error: any) {
    console.error('Error creating content filter:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* CREATE USER BAN */
export const createUserBan = async (
  req: FastifyRequest<{ Body: CreateUserBanInput }>,
  reply: FastifyReply
) => {
  try {
    const ban = await createUserBanService(req.body);
    reply.code(201).send(ban);
  } catch (error: any) {
    console.error('Error creating user ban:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* GET MODERATION REPORT BY ID */
export const getModerationReportById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const report = await getModerationReportByIdService(req.params.id);

    if (!report) {
      return reply.code(404).send({ message: 'Moderation report not found' });
    }

    reply.send(report);
  } catch (error: any) {
    console.error('Error getting moderation report by ID:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* GET MODERATION REPORTS BY STATUS */
export const getModerationReportsByStatus = async (
  req: FastifyRequest<{
    Params: { status: string };
    Querystring: {
      limit?: string;
      offset?: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { status } = req.params;
    const { limit = '20', offset = '0' } = req.query;
    
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);
    
    const reports = await getModerationReportsByStatusService(status, limitNum, offsetNum);
    
    reply.send(reports);
  } catch (error: any) {
    console.error('Error getting moderation reports by status:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* UPDATE MODERATION REPORT */
export const updateModerationReport = async (
  req: FastifyRequest<{
    Params: { id: string };
    Body: UpdateModerationReportInput;
  }>,
  reply: FastifyReply
) => {
  try {
    const report = await updateModerationReportService(
      req.params.id,
      req.body
    );

    if (!report) {
      return reply.code(404).send({ message: 'Moderation report not found' });
    }

    reply.send(report);
  } catch (error: any) {
    console.error('Error updating moderation report:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* GET CONTENT FILTERS BY CATEGORY */
export const getContentFiltersByCategory = async (
  req: FastifyRequest<{ Params: { category: string } }>,
  reply: FastifyReply
) => {
  try {
    const { category } = req.params;
    const filters = await getContentFiltersByCategoryService(category);
    
    reply.send(filters);
  } catch (error: any) {
    console.error('Error getting content filters by category:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* GET ALL CONTENT FILTERS */
export const getAllContentFilters = async (
  _req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const filters = await getAllContentFiltersService();
    
    reply.send(filters);
  } catch (error: any) {
    console.error('Error getting all content filters:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* CHECK CONTENT FOR FILTERS */
export const checkContentForFilters = async (
  req: FastifyRequest<{
    Querystring: {
      content: string;
      category?: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { content, category } = req.query;
    
    if (!content) {
      return reply.code(400).send({ message: 'Content is required' });
    }
    
    const result = await checkContentForFiltersService(content, category);
    
    reply.send(result);
  } catch (error: any) {
    console.error('Error checking content for filters:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* GET ACTIVE USER BANS */
export const getActiveUserBans = async (
  req: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = req.params;
    const bans = await getActiveUserBansService(userId);
    
    reply.send(bans);
  } catch (error: any) {
    console.error('Error getting active user bans:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* LIFT USER BAN */
export const liftUserBan = async (
  req: FastifyRequest<{ Params: { banId: string; moderatorId: string } }>,
  reply: FastifyReply
) => {
  try {
    const { banId, moderatorId } = req.params;
    const success = await liftUserBanService(banId, moderatorId);

    if (!success) {
      return reply.code(404).send({ message: 'User ban not found' });
    }

    reply.send({ message: 'User ban lifted successfully' });
  } catch (error: any) {
    console.error('Error lifting user ban:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};