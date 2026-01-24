import Ajv from 'ajv';
import { CompressionTypes, Kafka, SASLOptions } from 'kafkajs';

export interface KafkaConfig {
  clientId: string;
  brokers: string[];
  ssl?: boolean;
  sasl?: SASLOptions;
}

type Schema = Record<string, any>;

export class KafkaManager {
  private kafka: Kafka;
  private producer = null as any;
  private ajv = new Ajv();
  private schemas = new Map<string, Schema>();

  constructor(config: KafkaConfig) {
    this.kafka = new Kafka(config);
    this.producer = this.kafka.producer();

    this.registerSchemas();
  }

  private registerSchemas() {
    this.schemas.set('user.created', {
      type: 'object',
      required: ['userId', 'email', 'username', 'timestamp'],
      properties: {
        userId: { type: 'string' },
        email: { type: 'string' },
        username: { type: 'string' },
        timestamp: { type: 'string' }
      }
    });
  }

  async connect() {
    await this.producer.connect();
  }

  async disconnect() {
    await this.producer.disconnect();
  }

  async publish(topic: string, payload: any) {
    const schema = this.schemas.get(topic);
    if (schema && !this.ajv.validate(schema, payload)) {
      throw new Error(`Invalid payload for ${topic}`);
    }

    await this.producer.send({
      topic,
      compression: CompressionTypes.GZIP,
      messages: [
        {
          key: payload.userId,
          value: JSON.stringify(payload)
        }
      ]
    });
  }

  async consume(
    groupId: string,
    topics: string[],
    handler: (data: any) => Promise<void>
  ) {
    const consumer = this.kafka.consumer({ groupId });

    await consumer.connect();
    for (const topic of topics) {
      await consumer.subscribe({ topic });
    }

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        if (!message.value) return;

        const data = JSON.parse(message.value.toString());
        const schema = this.schemas.get(topic);

        if (schema && !this.ajv.validate(schema, data)) return;

        await handler(data);
      }
    });
  }
}
