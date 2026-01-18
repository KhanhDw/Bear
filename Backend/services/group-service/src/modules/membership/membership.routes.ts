import { FastifyInstance } from 'fastify';
import {
  addMemberToGroup,
  getGroupMemberById,
  getGroupMemberByGroupAndUser,
  getGroupMembers,
  getUserGroups,
  updateGroupMembership,
  removeMemberFromGroup,
  transferGroupOwnership,
} from './membership.controller.js';

export const membershipRoutes = async (fastify: FastifyInstance) => {
  // Add member to group
  fastify.post('/add', {}, addMemberToGroup);

  // Get group member by ID
  fastify.get('/:id', {}, getGroupMemberById);

  // Get group member by group and user
  fastify.get('/group/:groupId/user/:userId', {}, getGroupMemberByGroupAndUser);

  // Get all members of a group
  fastify.get('/group/:groupId', {}, getGroupMembers);

  // Get all groups a user belongs to
  fastify.get('/user/:userId', {}, getUserGroups);

  // Update group membership
  fastify.put('/:id', {}, updateGroupMembership);

  // Remove member from group
  fastify.delete('/group/:groupId/user/:userId', {}, removeMemberFromGroup);

  // Transfer group ownership
  fastify.put('/transfer/:groupId/new-owner/:newOwnerId', {}, transferGroupOwnership);
};