import dotenv from "dotenv";
dotenv.config();
import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "post-service",
  brokers: [process.env.KAFKA_BROKER || "kafka-service:9092"],
  retry: {
    initialRetryTime: 100,
    retries: 10,
    maxRetryTime: 30000,
  },
  connectionTimeout: 10000,
  requestTimeout: 30000,
});
