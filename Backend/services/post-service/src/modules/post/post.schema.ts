export const createPostSchema = {
  body: {
    type: "object",
    required: ["post_content", "post_author_id"],
    properties: {
      post_content: { type: "string" },
      post_author_id: { type: "number" },
    },
  },
};
