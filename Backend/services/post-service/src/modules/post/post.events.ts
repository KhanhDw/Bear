import { kafkaProducer } from "../../config/kafka.js";
import { type DomainEvent } from "@libs/kafka/types.js";
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

const UPDATE_TOPIC = "post.updated";

export async function publishPostUpdated(post: {
  post_id: string;
  post_content: string;
  post_author_id: string;
}) {
  const event: DomainEvent = {
    eventId: randomUUID(),
    eventType: "PostUpdated",
    occurredAt: new Date().toISOString(),
    payload: post,
  };

  console.log("📤 Sending event post.updated", event);

  await kafkaProducer.send({
    topic: UPDATE_TOPIC,
    messages: [
      {
        key: post.post_id,
        value: JSON.stringify(event),
      },
    ],
  });

  console.log("✅ Event sent");
}

const DELETE_TOPIC = "post.deleted";

export async function publishPostDeleted(input: {
  post_id: string;
  post_author_id: string;
}) {
  const event: DomainEvent = {
    eventId: randomUUID(),
    eventType: "PostDeleted",
    occurredAt: new Date().toISOString(),
    payload: input,
  };

  console.log("📤 Sending event post.deleted", event);

  await kafkaProducer.send({
    topic: DELETE_TOPIC,
    messages: [
      {
        key: input.post_id,
        value: JSON.stringify(event),
      },
    ],
  });

  console.log("✅ Event sent");
}
