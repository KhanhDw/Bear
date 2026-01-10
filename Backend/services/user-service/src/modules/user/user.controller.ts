import { FastifyRequest, FastifyReply } from "fastify";
import {
  createUserService,
  getUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
} from "./user.service.js";
import { CreateUserInput, UpdateUserInput } from "./user.types.js";

/* CREATE */
export const createUser = async (
  req: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply
) => {
  try {
    const user = await createUserService(req.body);
    reply.code(201).send(user);
  } catch (error: any) {
    if (error.message.includes("already exists")) {
      reply.code(409).send({ message: error.message });
    } else {
      reply.code(500).send({ message: "Internal server error" });
    }
  }
};

/* READ ALL */
export const getUsers = async (_req: FastifyRequest, reply: FastifyReply) => {
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

/* UPDATE */
export const updateUser = async (
  req: FastifyRequest<{
    Params: { id: string };
    Body: UpdateUserInput;
  }>,
  reply: FastifyReply
) => {
  try {
    const user = await updateUserService(req.params.id, req.body);

    if (!user) {
      return reply.code(404).send({ message: "User not found" });
    }

    reply.send(user);
  } catch (error: any) {
    if (error.message.includes("already exists")) {
      reply.code(409).send({ message: error.message });
    } else {
      reply.code(500).send({ message: "Internal server error" });
    }
  }
};

/* DELETE */
export const deleteUser = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const success = await deleteUserService(req.params.id);

  if (!success) {
    return reply.code(404).send({ message: "User not found" });
  }

  reply.code(204).send();
};