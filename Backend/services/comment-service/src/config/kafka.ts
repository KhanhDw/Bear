import {
  createKafkaClient,
  createProducer,
} from "../../../../libs/kafka/index.js";

console.log("==>process.env.KAFKA_BROKER", process.env.KAFKA_BROKER);

export const kafka = createKafkaClient([
  process.env.KAFKA_BROKER || "localhost:9092",
]);

export const kafkaProducer = createProducer();

// Connect producer when module loads
kafkaProducer.connect();