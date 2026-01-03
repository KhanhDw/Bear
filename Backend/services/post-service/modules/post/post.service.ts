import { CreatePostInput, Post } from "./post.types.js";
import { insertPost } from "./post.repository.js";
import { publishPostCreated } from "./post.events.js";

export const createPostService = async (
  input: CreatePostInput
): Promise<Post> => {
  const post = await insertPost(input);

  // side-effect async
  await publishPostCreated(post);

  return post;
};
/*
⚠️ Điểm rất quan trọng:
Hiện tại Kafka failure sẽ làm request fail vì bạn await.
*/
