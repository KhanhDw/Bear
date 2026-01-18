import { FastifyRequest, FastifyReply } from 'fastify';
import {
  addMemberToGroupService,
  getGroupMemberByIdService,
  getGroupMemberByGroupAndUserService,
  getGroupMembersService,
  getUserGroupsService,
  updateGroupMembershipService,
  removeMemberFromGroupService,
  transferGroupOwnershipService,
} from './membership.service.js';
import { CreateMembershipInput, UpdateMembershipInput } from './membership.types.js';

/* ADD MEMBER TO GROUP */
export const addMemberToGroup = async (
  req: FastifyRequest<{ Body: CreateMembershipInput }>,
  reply: FastifyReply
) => {
  try {
    const member = await addMemberToGroupService(req.body);
    reply.code(201).send(member);
  } catch (error: any) {
    console.error('Error adding member to group:', error);
    if (error.message === 'User is already a member of this group') {
      reply.code(409).send({ message: error.message });
    } else {
      reply.code(500).send({ message: 'Internal server error' });
    }
  }
};

/* GET MEMBER BY ID */
export const getGroupMemberById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const member = await getGroupMemberByIdService(req.params.id);

    if (!member) {
      return reply.code(404).send({ message: 'Group member not found' });
    }

    reply.send(member);
  } catch (error: any) {
    console.error('Error getting group member by ID:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* GET MEMBER BY GROUP AND USER */
export const getGroupMemberByGroupAndUser = async (
  req: FastifyRequest<{ Params: { groupId: string; userId: string } }>,
  reply: FastifyReply
) => {
  try {
    const { groupId, userId } = req.params;
    const member = await getGroupMemberByGroupAndUserService(groupId, userId);

    if (!member) {
      return reply.code(404).send({ message: 'Group member not found' });
    }

    reply.send(member);
  } catch (error: any) {
    console.error('Error getting group member by group and user:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* GET MEMBERS OF GROUP */
export const getGroupMembers = async (
  req: FastifyRequest<{
    Params: { groupId: string };
    Querystring: {
      role?: string;
      limit?: string;
      offset?: string;
    };
  }>,
  reply: FastifyReply
) => {
  try {
    const { groupId } = req.params;
    const { role, limit = '50', offset = '0' } = req.query;
    
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);
    
    const members = await getGroupMembersService(groupId, role, limitNum, offsetNum);
    
    reply.send(members);
  } catch (error: any) {
    console.error('Error getting group members:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* GET USER GROUPS */
export const getUserGroups = async (
  req: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) => {
  try {
    const { userId } = req.params;
    const groups = await getUserGroupsService(userId);
    
    reply.send(groups);
  } catch (error: any) {
    console.error('Error getting user groups:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* UPDATE MEMBERSHIP */
export const updateGroupMembership = async (
  req: FastifyRequest<{
    Params: { id: string };
    Body: UpdateMembershipInput;
  }>,
  reply: FastifyReply
) => {
  try {
    const member = await updateGroupMembershipService(
      req.params.id,
      req.body
    );

    if (!member) {
      return reply.code(404).send({ message: 'Group member not found' });
    }

    reply.send(member);
  } catch (error: any) {
    console.error('Error updating group membership:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* REMOVE MEMBER FROM GROUP */
export const removeMemberFromGroup = async (
  req: FastifyRequest<{ Params: { groupId: string; userId: string } }>,
  reply: FastifyReply
) => {
  try {
    const { groupId, userId } = req.params;
    const success = await removeMemberFromGroupService(groupId, userId);

    if (!success) {
      return reply.code(404).send({ message: 'Group member not found' });
    }

    reply.code(204).send();
  } catch (error: any) {
    console.error('Error removing member from group:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};

/* TRANSFER OWNERSHIP */
export const transferGroupOwnership = async (
  req: FastifyRequest<{ Params: { groupId: string; newOwnerId: string } }>,
  reply: FastifyReply
) => {
  try {
    const { groupId, newOwnerId } = req.params;
    const success = await transferGroupOwnershipService(groupId, newOwnerId);

    if (!success) {
      return reply.code(404).send({ message: 'Unable to transfer ownership' });
    }

    reply.send({ message: 'Group ownership transferred successfully' });
  } catch (error: any) {
    console.error('Error transferring group ownership:', error);
    reply.code(500).send({ message: 'Internal server error' });
  }
};