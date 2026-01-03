import { kafka } from "./kafka.client.js";
import { TOPICS } from "./topics.js";

const consumer = kafka.consumer({ groupId: "notification-service" });

export const startPostCreatedConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: TOPICS.POST_CREATED,
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const payload = JSON.parse(message.value.toString());

      console.log("📨 New post event:", payload);

      // gửi notification, push, email, v.v.
    },
  });
};
