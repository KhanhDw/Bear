import { kafkaProducer } from "../../config/kafka.js";
import { type DomainEvent } from "@libs/kafka/types.js";
import { randomUUID } from "crypto";

const USER_CREATED_TOPIC = "user.created";

export async function publishUserCreated(user: {
  user_id: string;
  username: string;
  email: string;
  user_created_at: Date;
}) {
  const event: DomainEvent = {
    eventId: randomUUID(),
    eventType: "UserCreated",
    occurredAt: new Date().toISOString(),
    payload: user,
  };
  console.log("📤 Sending event user.created", event);
  await kafkaProducer.send({
    topic: USER_CREATED_TOPIC,
    messages: [
      {
        key: user.user_id,
        value: JSON.stringify(event),
      },
    ],
  });
  console.log("✅ Event sent");
}

const USER_UPDATED_TOPIC = "user.updated";

export async function publishUserUpdated(user: {
  user_id: string;
  username: string;
  email: string;
}) {
  const event: DomainEvent = {
    eventId: randomUUID(),
    eventType: "UserUpdated",
    occurredAt: new Date().toISOString(),
    payload: user,
  };

  console.log("📤 Sending event user.updated", event);

  await kafkaProducer.send({
    topic: USER_UPDATED_TOPIC,
    messages: [
      {
        key: user.user_id,
        value: JSON.stringify(event),
      },
    ],
  });

  console.log("✅ Event sent");
}

const USER_DELETED_TOPIC = "user.deleted";

export async function publishUserDeleted(input: {
  user_id: string;
}) {
  const event: DomainEvent = {
    eventId: randomUUID(),
    eventType: "UserDeleted",
    occurredAt: new Date().toISOString(),
    payload: input,
  };

  console.log("📤 Sending event user.deleted", event);

  await kafkaProducer.send({
    topic: USER_DELETED_TOPIC,
    messages: [
      {
        key: input.user_id,
        value: JSON.stringify(event),
      },
    ],
  });

  console.log("✅ Event sent");
}