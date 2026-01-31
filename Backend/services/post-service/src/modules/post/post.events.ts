import { type DomainEvent } from "@libs/kafka/types.js";
import { randomUUID } from "crypto";
import { kafkaProducer } from "../../config/kafka.js";
import { Post } from "./post.types.js";

const TOPIC = "post.created";

export async function publishPostCreated(post: {
  post_id: string;
  post_content: string;
  post_author_id: string;
  post_created_at: string;
}, { traceId }: { traceId?: string } = {}) {
  try {
    const event: DomainEvent = {
      eventId: randomUUID(),
      eventType: "PostCreated",
      occurredAt: new Date().toISOString(),
      payload: post,
    };

    console.log("Sending event post.created", event.eventId);

    await kafkaProducer.send({
      topic: TOPIC,
      messages: [
        {
          key: post.post_id,
          headers: { 'x-trace-id': traceId },
          value: JSON.stringify(event),
        },
      ],
    });

    console.log("Event sent successfully", event.eventId);
  } catch (error) {
    console.error("Failed to publish PostCreated event:", error);
    throw error; // Re-throw to allow calling function to handle
  }
}

const UPDATE_TOPIC = "post.updated";

export async function publishPostUpdated(post: Post, ctx?: { traceId?: string }) {
  try {
    const event: DomainEvent = {
      eventId: randomUUID(),
      eventType: "PostUpdated",
      occurredAt: new Date().toISOString(),
      payload: post,
    };

    console.log("Sending event post.updated", event.eventId);

    await kafkaProducer.send({
      topic: UPDATE_TOPIC,
      messages: [
        {
          key: post.post_id,
          headers: { 'x-trace-id': ctx?.traceId },
          value: JSON.stringify(event),
        },
      ],
    });

    console.log("Event sent successfully", event.eventId);
  } catch (error) {
    console.error("Failed to publish PostUpdated event:", error);
    throw error; // Re-throw to allow calling function to handle
  }
}

const DELETE_TOPIC = "post.deleted";

export async function publishPostDeleted(input: {
  post_id: string;
  post_author_id: string;
}) {
  try {
    const event: DomainEvent = {
      eventId: randomUUID(),
      eventType: "PostDeleted",
      occurredAt: new Date().toISOString(),
      payload: input,
    };

    console.log("Sending event post.deleted", event.eventId);

    await kafkaProducer.send({
      topic: DELETE_TOPIC,
      messages: [
        {
          key: input.post_id,
          value: JSON.stringify(event),
        },
      ],
    });

    console.log("Event sent successfully", event.eventId);
  } catch (error) {
    console.error("Failed to publish PostDeleted event:", error);
    throw error; // Re-throw to allow calling function to handle
  }
}
