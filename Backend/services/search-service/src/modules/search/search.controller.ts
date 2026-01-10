import { FastifyRequest, FastifyReply } from "fastify";
import {
  searchService,
} from "./search.service.js";
import { SearchInput } from "./search.types.js";

/* SEARCH */
export const search = async (
  req: FastifyRequest<{ 
    Querystring: { 
      q: string; 
      type?: "post" | "user" | "comment" | "all"; 
      limit?: string; 
      offset?: string; 
    } 
  }>,
  reply: FastifyReply
) => {
  const { q: query, type = "all", limit = "20", offset = "0" } = req.query;
  
  if (!query) {
    return reply.status(400).send({ error: "Query parameter 'q' is required" });
  }
  
  const input: SearchInput = {
    query,
    type,
    limit: parseInt(limit),
    offset: parseInt(offset),
  };

  const result = await searchService(input);
  reply.send(result);
};