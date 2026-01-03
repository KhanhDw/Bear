import { Post } from "./post.types.js";

export const publishPostCreated = async (post: Post) => {
  // giả lập Kafka
  console.log("[EVENT] post.created", {
    postId: post.id,
    authorId: post.authorId,
  });
};
