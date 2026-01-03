export const createPostSchema = {
  body: {
    type: "object",
    required: ["title", "content", "authorId"],
    properties: {
      title: { type: "string", minLength: 1 },
      content: { type: "string" },
      authorId: { type: "string" },
    },
  },
};
