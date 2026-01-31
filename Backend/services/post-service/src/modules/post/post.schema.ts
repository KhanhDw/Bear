export const createPostSchema = {
  body: {
    type: "object",
    required: ["post_content", "post_author_id"],
    properties: {
      post_content: {
        type: "string",
        minLength: 1,
        maxLength: 10000  // Limit post content length
      },
      post_author_id: {
        type: "string",
        minLength: 1,
        maxLength: 100  // Reasonable length for user ID
      },
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
      post_content: {
        type: "string",
        minLength: 1,
        maxLength: 10000  // Limit post content length
      },
    },
  },
};
