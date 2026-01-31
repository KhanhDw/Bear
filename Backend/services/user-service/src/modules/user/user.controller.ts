import { FastifyReply, FastifyRequest } from "fastify";
import { AuthenticatedRequest } from "./auth.middleware.js";
import {
  checkIfFollowingService,
  createUserService,
  deleteUserService,
  followUserService,
  getFollowersService,
  getFollowingService,
  getUserByAuthIdService,
  getUserByIdService,
  getUsersService,
  unfollowUserService,
  updateUserService,
} from "./user.service.js";
import { CreateUserInput, FollowUserInput, UpdateUserInput } from "./user.types.js";

/* CREATE */
export const createUser = async (
  req: AuthenticatedRequest & FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply
) => {
  try {
    // Use the authenticated user's ID as the auth_user_id
    if (!req.user) {
      return reply.code(401).send({ message: "Unauthorized" });
    }

    // Override the auth_user_id from the authenticated user
    const userInput: CreateUserInput = {
      ...req.body,
      auth_user_id: req.user.user_id  // Use the authenticated user's ID
    };

    const user = await createUserService(userInput);
    reply.code(201).send(user);
  } catch (error: any) {
    if (error.message.includes("already exists") || error.message.includes("already taken")) {
      reply.code(409).send({ message: error.message });
    } else {
      reply.code(500).send({ message: "Internal server error" });
    }
  }
};

/* READ ALL */
export const getUsers = async (
  req: AuthenticatedRequest & FastifyRequest,
  reply: FastifyReply
) => {
  if (!req.user) {
    return reply.code(401).send({ message: "Unauthorized" });
  }

  const users = await getUsersService();
  reply.send(users);
};

/* READ ONE */
export const getUserById = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const user = await getUserByIdService(req.params.id);

  if (!user) {
    return reply.code(404).send({ message: "User not found" });
  }

  reply.send(user);
};

/* READ BY AUTH ID */
export const getUserByAuthId = async (
  req: FastifyRequest<{ Params: { authId: string } }>,
  reply: FastifyReply
) => {
  const user = await getUserByAuthIdService(req.params.authId);

  if (!user) {
    return reply.code(404).send({ message: "User not found" });
  }

  reply.send(user);
};

/* UPDATE */
export const updateUser = async (
  req: AuthenticatedRequest & FastifyRequest<{
    Params: { id: string };
    Body: UpdateUserInput;
  }>,
  reply: FastifyReply
) => {
  if (!req.user) {
    return reply.code(401).send({ message: "Unauthorized" });
  }

  // Ensure user can only update their own profile
  const userToUpdate = await getUserByIdService(req.params.id);
  if (!userToUpdate || userToUpdate.auth_user_id !== req.user.user_id) {
    return reply.code(403).send({ message: "Forbidden: Cannot update another user's profile" });
  }

  try {
    const user = await updateUserService(req.params.id, req.body);

    if (!user) {
      return reply.code(404).send({ message: "User not found" });
    }

    reply.send(user);
  } catch (error: any) {
    if (error.message.includes("already taken")) {
      reply.code(409).send({ message: error.message });
    } else {
      reply.code(500).send({ message: "Internal server error" });
    }
  }
};

/* DELETE */
export const deleteUser = async (
  req: AuthenticatedRequest & FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  if (!req.user) {
    return reply.code(401).send({ message: "Unauthorized" });
  }

  // Ensure user can only delete their own profile
  const userToDelete = await getUserByIdService(req.params.id);
  if (!userToDelete || userToDelete.auth_user_id !== req.user.user_id) {
    return reply.code(403).send({ message: "Forbidden: Cannot delete another user's profile" });
  }

  const success = await deleteUserService(req.params.id);

  if (!success) {
    return reply.code(404).send({ message: "User not found" });
  }

  reply.code(204).send();
};

/* FOLLOW */
export const followUser = async (
  req: AuthenticatedRequest & FastifyRequest<{ Body: FollowUserInput }>,
  reply: FastifyReply
) => {
  if (!req.user) {
    return reply.code(401).send({ message: "Unauthorized" });
  }

  try {
    // Use the authenticated user as the follower
    const followInput: FollowUserInput = {
      ...req.body,
      follower_id: req.user.user_id  // Use the authenticated user's ID as follower
    };

    const success = await followUserService(followInput);

    if (!success) {
      return reply.code(400).send({ message: "Unable to follow user" });
    }

    reply.send({ message: "Successfully followed user" });
  } catch (error: any) {
    if (error.message.includes("cannot follow themselves")) {
      reply.code(400).send({ message: error.message });
    } else {
      reply.code(500).send({ message: "Internal server error" });
    }
  }
};

/* UNFOLLOW */
export const unfollowUser = async (
  req: AuthenticatedRequest & FastifyRequest<{ Body: FollowUserInput }>,
  reply: FastifyReply
) => {
  if (!req.user) {
    return reply.code(401).send({ message: "Unauthorized" });
  }

  try {
    // Use the authenticated user as the follower
    const input = req.body;
    const success = await unfollowUserService({
      follower_id: req.user.user_id,  // Use the authenticated user's ID as follower
      following_id: input.following_id
    });

    if (!success) {
      return reply.code(400).send({ message: "Not following this user" });
    }

    reply.send({ message: "Successfully unfollowed user" });
  } catch (error: any) {
    reply.code(500).send({ message: "Internal server error" });
  }
};

/* GET FOLLOWERS */
export const getFollowers = async (
  req: FastifyRequest<{ Params: { id: string }; Query: { limit?: string; offset?: string } }>,
  reply: FastifyReply
) => {
  try {
    const userId = req.params.id;
    const limit = parseInt((req.query as { limit?: string }).limit || '20', 10);
    const offset = parseInt((req.query as { offset?: string }).offset || '0', 10);

    const followers = await getFollowersService(userId, limit, offset);

    reply.send(followers);
  } catch (error: any) {
    reply.code(500).send({ message: "Internal server error" });
  }
};

/* GET FOLLOWING */
export const getFollowing = async (
  req: FastifyRequest<{ Params: { id: string }; Query: { limit?: string; offset?: string } }>,
  reply: FastifyReply
) => {
  try {
    const userId = req.params.id;
    const limit = parseInt((req.query as { limit?: string }).limit || '20', 10);
    const offset = parseInt((req.query as { offset?: string }).offset || '0', 10);

    const following = await getFollowingService(userId, limit, offset);

    reply.send(following);
  } catch (error: any) {
    reply.code(500).send({ message: "Internal server error" });
  }
};

/* CHECK IF FOLLOWING */
export const checkIfFollowing = async (
  req: AuthenticatedRequest,
  reply: FastifyReply
) => {
  if (!req.user) {
    return reply.code(401).send({ message: "Unauthorized" });
  }

  try {
    // Use the authenticated user's ID as the follower if not provided
    const typedQuery = req.query as { follower_id?: string; following_id: string };
    const followerId = typedQuery.follower_id || req.user.user_id;
    const followingId = typedQuery.following_id;

    const isFollowing = await checkIfFollowingService(followerId, followingId);

    reply.send({ is_following: isFollowing });
  } catch (error: any) {
    reply.code(500).send({ message: "Internal server error" });
  }
};