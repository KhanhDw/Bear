import { producer } from "../../../../libs/kafka/kafka.producer.js";
import { TOPICS } from "../../../../libs/kafka/topics.js";
import { Post } from "./post.types.js";

export const publishPostCreated = async (post: Post) => {
  await producer.send({
    topic: TOPICS.POST_CREATED,
    messages: [
      {
        key: post.post_id,
        value: JSON.stringify({
          post_id: post.post_id,
          post_author_id: post.post_author_id,
          created_at: post.post_created_at,
        }),
      },
    ],
  });

  // giả lập Kafka
  // console.log("--> [EVENT] post.created", {
  //   post_id: post.post_id,
  //   post_author_id: post.post_author_id,
  // });
};
