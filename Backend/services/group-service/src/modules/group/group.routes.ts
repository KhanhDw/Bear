import { FastifyInstance } from 'fastify';
import {
  createGroup,
  getGroupById,
  getAllGroups,
  getGroupsByPrivacy,
  getGroupsByCreator,
  updateGroup,
  deleteGroup,
  searchGroups,
} from './group.controller.js';

export const groupRoutes = async (fastify: FastifyInstance) => {
  // Create a new group
  fastify.post('/', {}, createGroup);

  // Get a group by ID
  fastify.get('/:id', {}, getGroupById);

  // Get all groups
  fastify.get('/', {}, getAllGroups);

  // Get groups by privacy level
  fastify.get('/privacy/:privacyLevel', {}, getGroupsByPrivacy);

  // Get groups by creator
  fastify.get('/creator/:creatorId', {}, getGroupsByCreator);

  // Update a group
  fastify.put('/:id', {}, updateGroup);

  // Delete a group
  fastify.delete('/:id', {}, deleteGroup);

  // Search groups
  fastify.get('/search', {}, searchGroups);
};