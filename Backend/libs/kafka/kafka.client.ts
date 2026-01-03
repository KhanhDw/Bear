import dotenv from "dotenv";
dotenv.config();
import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: "post-service",
  brokers: [process.env.BROKERS_KAFKA_1 || "localhost:9092"],
});
