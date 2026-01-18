import { FastifyRequest, FastifyReply } from 'fastify';
import {
  createGroupService,
  getGroupByIdService,
  getAllGroupsService,
  getGroupsByPrivacyService,
  getGroupsByCreatorService,
  updateGroupService,
  deleteGroupService,
  searchGroupsByNameService,
} from './group.service.js';
import { CreateGroupInput, UpdateGroupInput } from './group.types.js';

/* CREATE */
export const createGroup = async (
  req: FastifyRequest<{ Body: CreateGroupInput }>,
  reply: FastifyReply
) => {
  try {
    const group = await createGroupService(req.body);
    reply.code(201).send(group);
  } catch (error: any) {
    console.error('Error creating group:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* READ ONE */
export const getGroupById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const group = await getGroupByIdService(req.params.id);

    if (!group) {
      return reply.code(404).send({ message: 'Group not found' });
    }

    reply.send(group);
  } catch (error: any) {
    console.error('Error getting group by ID:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* READ ALL */
export const getAllGroups = async (
  req: FastifyRequest<{
    Querystring: {
      limit?: string;
      offset?: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { limit = '20', offset = '0' } = req.query;
    
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);
    
    const groups = await getAllGroupsService(limitNum, offsetNum);
    
    reply.send(groups);
  } catch (error: any) {
    console.error('Error getting all groups:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* READ BY PRIVACY */
export const getGroupsByPrivacy = async (
  req: FastifyRequest<{
    Params: { privacyLevel: string };
    Querystring: {
      limit?: string;
      offset?: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { privacyLevel } = req.params;
    const { limit = '20', offset = '0' } = req.query;
    
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);
    
    const groups = await getGroupsByPrivacyService(privacyLevel, limitNum, offsetNum);
    
    reply.send(groups);
  } catch (error: any) {
    console.error('Error getting groups by privacy:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* READ BY CREATOR */
export const getGroupsByCreator = async (
  req: FastifyRequest<{ Params: { creatorId: string } }>,
  reply: FastifyReply
) => {
  try {
    const { creatorId } = req.params;
    const groups = await getGroupsByCreatorService(creatorId);
    
    reply.send(groups);
  } catch (error: any) {
    console.error('Error getting groups by creator:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* UPDATE */
export const updateGroup = async (
  req: FastifyRequest<{
    Params: { id: string };
    Body: UpdateGroupInput;
  }>,
  reply: FastifyReply
) => {
  try {
    const group = await updateGroupService(
      req.params.id,
      req.body
    );

    if (!group) {
      return reply.code(404).send({ message: 'Group not found' });
    }

    reply.send(group);
  } catch (error: any) {
    console.error('Error updating group:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* DELETE */
export const deleteGroup = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const success = await deleteGroupService(req.params.id);

    if (!success) {
      return reply.code(404).send({ message: 'Group not found' });
    }

    reply.code(204).send();
  } catch (error: any) {
    console.error('Error deleting group:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* SEARCH */
export const searchGroups = async (
  req: FastifyRequest<{
    Querystring: {
      q: string;
      limit?: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { q: searchTerm, limit = '20' } = req.query;
    
    if (!searchTerm) {
      return reply.code(400).send({ message: 'Search term is required' });
    }
    
    const limitNum = parseInt(limit);
    
    const groups = await searchGroupsByNameService(searchTerm, limitNum);
    
    reply.send(groups);
  } catch (error: any) {
    console.error('Error searching groups:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};