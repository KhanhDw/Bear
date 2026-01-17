import { Kafka, Producer, Consumer, Partitioners } from "kafkajs";

let kafka: Kafka;
let producer: Producer;
let consumer: Consumer;

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

export function createConsumer(groupId: string) {
  if (!kafka) throw new Error("Kafka not initialized");

  if (!consumer) {
    consumer = kafka.consumer({ groupId });
  }

  return consumer;
}

export async function connectProducer() {
  if (!producer) throw new Error("Producer not created");
  await producer.connect();
  console.log("✅ Kafka producer connected");
}

export async function connectConsumer() {
  if (!consumer) throw new Error("Consumer not created");
  await consumer.connect();
  console.log("✅ Kafka consumer connected");
}

export async function disconnectProducer() {
  if (producer) await producer.disconnect();
}

export async function disconnectConsumer() {
  if (consumer) await consumer.disconnect();
}