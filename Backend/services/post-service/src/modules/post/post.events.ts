import { Post } from "./post.types.js";

// export const publishPostCreated = async (post: Post) => {

//   // giả lập Kafka
//   // console.log("--> [EVENT] post.created", {
//   //   post_id: post.post_id,
//   //   post_author_id: post.post_author_id,
//   // });
// };

import { kafkaProducer } from "../../config/kafka.js";
import { type DomainEvent } from "../../../../../libs/kafka/types.js";
import { randomUUID } from "crypto";

const TOPIC = "post.created";

export async function publishPostCreated(post: {
  post_id: string;
  post_content: string;
  post_author_id: string;
  post_created_at: Date;
}) {
  const event: DomainEvent = {
    eventId: randomUUID(),
    eventType: "PostCreated",
    occurredAt: new Date().toISOString(),
    payload: post,
  };
  console.log("📤 Sending event post.created", event);
  await kafkaProducer.send({
    topic: TOPIC,
    messages: [
      {
        key: post.post_id,
        value: JSON.stringify(event),
      },
    ],
  });
  console.log("✅ Event sent");
}
