import { Kafka, Producer, Consumer, Partitioners } from "kafkajs";

let kafka: Kafka;
let producer: Producer;

export function createKafkaClient(brokers: string[]) {
  kafka = new Kafka({
    clientId: "social-feed-platform",
    brokers,
  });

  return kafka;
}

export function createProducer() {
  if (!kafka) throw new Error("Kafka not initialized");

  if (!producer) {
    producer = kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
    });
  }

  return producer;
}

export async function connectProducer() {
  if (!producer) throw new Error("Producer not created");
  await producer.connect();
  console.log("✅ Kafka producer connected");
}

export async function disconnectProducer() {
  if (producer) await producer.disconnect();
}
