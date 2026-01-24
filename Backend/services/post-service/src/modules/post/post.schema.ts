export const createPostSchema = {
  body: {
    type: "object",
    required: ["post_content", "post_author_id"],
    properties: {
      post_content: { type: "string" },
      post_author_id: { type: "string" },
    },
  },
};
export const updatePostSchema = {
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
      post_content: { type: "string" },
    },
  },
};
