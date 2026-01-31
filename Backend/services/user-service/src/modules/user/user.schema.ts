export const createUserSchema = {
  body: {
    type: "object",
    required: ["auth_user_id", "username"],
    properties: {
      auth_user_id: { type: "string" },
      username: { type: "string", minLength: 3, maxLength: 30 },
      display_name: { type: "string", maxLength: 100 },
      avatar_url: { type: "string", format: "uri" },
      bio: { type: "string", maxLength: 500 },
    },
  },
};

export const updateUserSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string", format: "uuid" },
    },
  },
  body: {
    type: "object",
    required: [],
    properties: {
      username: { type: "string", minLength: 3, maxLength: 30 },
      display_name: { type: "string", maxLength: 100 },
      avatar_url: { type: "string", format: "uri" },
      bio: { type: "string", maxLength: 500 },
    },
  },
};

export const followUserSchema = {
  body: {
    type: "object",
    required: ["follower_id", "following_id"],
    properties: {
      follower_id: { type: "string", format: "uuid" },
      following_id: { type: "string", format: "uuid" },
    },
  },
};