import { FastifyRequest, FastifyReply } from "fastify";
import {
  getUserFeedService,
  addToUserService,
  removeFromFeedService,
} from "./feed.service.js";
import { GetFeedInput } from "./feed.types.js";

/* READ USER FEED */
export const getUserFeed = async (
  req: FastifyRequest<{ 
    Querystring: { 
      user_id: string; 
      limit?: string; 
      offset?: string; 
    } 
  }>,
  reply: FastifyReply
) => {
  const { user_id, limit = "20", offset = "0" } = req.query;
  const input: GetFeedInput = {
    user_id,
    limit: parseInt(limit),
    offset: parseInt(offset),
  };

  const result = await getUserFeedService(input);
  reply.send(result);
};

/* ADD TO FEED */
export const addToFeed = async (
  req: FastifyRequest<{ Body: { user_id: string; post_id: string } }>,
  reply: FastifyReply
) => {
  const { user_id, post_id } = req.body;
  
  await addToUserService(user_id, post_id);
  reply.code(201).send({ message: "Post added to feed successfully" });
};

/* REMOVE FROM FEED */
export const removeFromFeed = async (
  req: FastifyRequest<{ Body: { user_id: string; post_id: string } }>,
  reply: FastifyReply
) => {
  const { user_id, post_id } = req.body;
  
  const success = await removeFromFeedService(user_id, post_id);

  if (!success) {
    return reply.code(404).send({ message: "Feed item not found" });
  }

  reply.send({ message: "Post removed from feed successfully" });
};