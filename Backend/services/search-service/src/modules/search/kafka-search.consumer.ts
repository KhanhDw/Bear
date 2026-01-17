import SearchService from "./search.service.js";

class KafkaSearchConsumer {
  private static instance: KafkaSearchConsumer;
  private consumer: any;

  private constructor() {}

  public static getInstance(): KafkaSearchConsumer {
    if (!KafkaSearchConsumer.instance) {
      KafkaSearchConsumer.instance = new KafkaSearchConsumer();
    }
    return KafkaSearchConsumer.instance;
  }

  async initialize(): Promise<void> {
    // Create and connect Kafka consumer
    const kafkaBrokers = process.env.KAFKA_BROKERS?.split(",") || [
      "localhost:9092",
    ];
    const kafkaGroupId = process.env.KAFKA_GROUP_ID || "search-service-group";

    const kafka = await import("kafkajs"); // Dynamic import to avoid circular dependencies

    const kafkaClient = new kafka.Kafka({
      clientId: "search-service-consumer",
      brokers: kafkaBrokers,
    });

    this.consumer = kafkaClient.consumer({ groupId: kafkaGroupId });

    await this.consumer.connect();
    console.log("✅ Kafka consumer connected for search service");

    // Subscribe to relevant topics
    await this.consumer.subscribe({
      topic: "post.created",
      fromBeginning: true,
    });
    await this.consumer.subscribe({
      topic: "post.updated",
      fromBeginning: true,
    });
    await this.consumer.subscribe({
      topic: "post.deleted",
      fromBeginning: true,
    });
    await this.consumer.subscribe({
      topic: "user.created",
      fromBeginning: true,
    });
    await this.consumer.subscribe({
      topic: "user.updated",
      fromBeginning: true,
    });
    await this.consumer.subscribe({
      topic: "user.deleted",
      fromBeginning: true,
    });
    await this.consumer.subscribe({
      topic: "comment.created",
      fromBeginning: true,
    });
    await this.consumer.subscribe({
      topic: "comment.updated",
      fromBeginning: true,
    });
    await this.consumer.subscribe({
      topic: "comment.deleted",
      fromBeginning: true,
    });

    // Run the consumer
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }: any) => {
        try {
          const eventStr = message.value?.toString();
          if (!eventStr) {
            console.warn("Received empty message from Kafka");
            return;
          }

          const event = JSON.parse(eventStr);
          console.log(
            `Received event: ${event.eventType} from topic: ${topic}`,
          );

          // Convert event types to match what the handler expects
          let normalizedEvent = { ...event };

          // Map the post service event types to our expected types
          if (event.eventType === "PostCreated") {
            normalizedEvent = {
              eventType: "POST_CREATED",
              payload: {
                postId: event.payload.post_id,
                content: event.payload.post_content,
                authorId: event.payload.post_author_id,
              },
            };
          } else if (event.eventType === "PostUpdated") {
            normalizedEvent = {
              eventType: "POST_UPDATED",
              payload: {
                postId: event.payload.post_id,
                content: event.payload.post_content,
                authorId: event.payload.post_author_id,
              },
            };
          } else if (event.eventType === "PostDeleted") {
            normalizedEvent = {
              eventType: "POST_DELETED",
              payload: {
                postId: event.payload.post_id,
                authorId: event.payload.post_author_id,
              },
            };
          }
          // Map the user service event types to our expected types
          else if (event.eventType === "UserCreated") {
            normalizedEvent = {
              eventType: "USER_CREATED",
              payload: {
                userId: event.payload.user_id,
                username: event.payload.username,
                email: event.payload.email,
              },
            };
          } else if (event.eventType === "UserUpdated") {
            normalizedEvent = {
              eventType: "USER_UPDATED",
              payload: {
                userId: event.payload.user_id,
                username: event.payload.username,
                email: event.payload.email,
              },
            };
          } else if (event.eventType === "UserDeleted") {
            normalizedEvent = {
              eventType: "USER_DELETED",
              payload: {
                userId: event.payload.user_id,
              },
            };
          }
          // Map the comment service event types to our expected types
          else if (event.eventType === "CommentCreated") {
            normalizedEvent = {
              eventType: "COMMENT_CREATED",
              payload: {
                commentId: event.payload.comment_id,
                content: event.payload.content,
                userId: event.payload.user_id,
              },
            };
          } else if (event.eventType === "CommentUpdated") {
            normalizedEvent = {
              eventType: "COMMENT_UPDATED",
              payload: {
                commentId: event.payload.comment_id,
                content: event.payload.content,
                userId: event.payload.user_id,
              },
            };
          } else if (event.eventType === "CommentDeleted") {
            normalizedEvent = {
              eventType: "COMMENT_DELETED",
              payload: {
                commentId: event.payload.comment_id,
                userId: event.payload.user_id,
              },
            };
          }

          await SearchService.handleIncomingEvent(normalizedEvent);
        } catch (error) {
          console.error("Error processing Kafka message:", error);
        }
      },
    });

    console.log("✅ Kafka consumer running and listening for events");
  }

  async shutdown(): Promise<void> {
    if (this.consumer) {
      await this.consumer.disconnect();
      console.log("❌ Kafka consumer disconnected");
    }
  }
}

export default KafkaSearchConsumer.getInstance();
