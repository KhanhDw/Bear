export const createCommentSchema = {
  body: {
    type: "object",
    required: ["post_id", "user_id", "content"],
    properties: {
      post_id: { type: "string" },
      user_id: { type: "string" },
      content: { type: "string" },
    },
  },
};

export const updateCommentSchema = {
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
      content: { type: "string" },
    },
  },
};