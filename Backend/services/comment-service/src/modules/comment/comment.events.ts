import { kafkaProducer } from "../../config/kafka.js";
import { type DomainEvent } from "@libs/kafka/types.js";
import { randomUUID } from "crypto";

const COMMENT_CREATED_TOPIC = "comment.created";

export async function publishCommentCreated(comment: {
  comment_id: string;
  content: string;
  user_id: string;
  post_id: string;
  comment_created_at: Date;
}) {
  const event: DomainEvent = {
    eventId: randomUUID(),
    eventType: "CommentCreated",
    occurredAt: new Date().toISOString(),
    payload: comment,
  };
  console.log("📤 Sending event comment.created", event);
  await kafkaProducer.send({
    topic: COMMENT_CREATED_TOPIC,
    messages: [
      {
        key: comment.comment_id,
        value: JSON.stringify(event),
      },
    ],
  });
  console.log("✅ Event sent");
}

const COMMENT_UPDATED_TOPIC = "comment.updated";

export async function publishCommentUpdated(comment: {
  comment_id: string;
  content: string;
  user_id: string;
}) {
  const event: DomainEvent = {
    eventId: randomUUID(),
    eventType: "CommentUpdated",
    occurredAt: new Date().toISOString(),
    payload: comment,
  };

  console.log("📤 Sending event comment.updated", event);

  await kafkaProducer.send({
    topic: COMMENT_UPDATED_TOPIC,
    messages: [
      {
        key: comment.comment_id,
        value: JSON.stringify(event),
      },
    ],
  });

  console.log("✅ Event sent");
}

const COMMENT_DELETED_TOPIC = "comment.deleted";

export async function publishCommentDeleted(input: {
  comment_id: string;
  user_id: string;
}) {
  const event: DomainEvent = {
    eventId: randomUUID(),
    eventType: "CommentDeleted",
    occurredAt: new Date().toISOString(),
    payload: input,
  };

  console.log("📤 Sending event comment.deleted", event);

  await kafkaProducer.send({
    topic: COMMENT_DELETED_TOPIC,
    messages: [
      {
        key: input.comment_id,
        value: JSON.stringify(event),
      },
    ],
  });

  console.log("✅ Event sent");
}