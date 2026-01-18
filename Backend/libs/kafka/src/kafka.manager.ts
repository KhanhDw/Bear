import { Kafka, Producer, Consumer, CompressionTypes } from 'kafkajs';
import Ajv from 'ajv';

export interface KafkaConfig {
  clientId: string;
  brokers: string[];
  ssl?: boolean;
  sasl?: {
    mechanism: string;
    username: string;
    password: string;
  };
}

export interface EventSchema {
  type: 'object';
  properties: {
    [key: string]: any;
  };
  required: string[];
}

export class KafkaManager {
  private kafka: Kafka;
  private producer: Producer;
  private ajv: Ajv;
  private schemas: Map<string, EventSchema> = new Map();

  constructor(config: KafkaConfig) {
    this.kafka = new Kafka({
      clientId: config.clientId,
      brokers: config.brokers,
      ssl: config.ssl,
      sasl: config.sasl,
    });
    this.producer = this.kafka.producer();
    this.ajv = new Ajv();
    
    // Register standard schemas
    this.registerStandardSchemas();
  }

  private registerStandardSchemas() {
    // User event schema
    this.schemas.set('user.created', {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        email: { type: 'string' },
        username: { type: 'string' },
        timestamp: { type: 'string' }
      },
      required: ['userId', 'email', 'username', 'timestamp']
    });

    // Post event schema
    this.schemas.set('post.created', {
      type: 'object',
      properties: {
        postId: { type: 'string' },
        userId: { type: 'string' },
        content: { type: 'string' },
        timestamp: { type: 'string' }
      },
      required: ['postId', 'userId', 'content', 'timestamp']
    });

    // Comment event schema
    this.schemas.set('comment.created', {
      type: 'object',
      properties: {
        commentId: { type: 'string' },
        postId: { type: 'string' },
        userId: { type: 'string' },
        content: { type: 'string' },
        timestamp: { type: 'string' }
      },
      required: ['commentId', 'postId', 'userId', 'content', 'timestamp']
    });

    // Vote event schema
    this.schemas.set('vote.created', {
      type: 'object',
      properties: {
        voteId: { type: 'string' },
        userId: { type: 'string' },
        entityId: { type: 'string' },
        entityType: { type: 'string' },
        voteType: { type: 'string' },
        timestamp: { type: 'string' }
      },
      required: ['voteId', 'userId', 'entityId', 'entityType', 'voteType', 'timestamp']
    });
  }

  async connect() {
    await this.producer.connect();
  }

  async disconnect() {
    await this.producer.disconnect();
  }

  async publish(topic: string, message: any, key?: string) {
    // Validate message against schema
    const schema = this.schemas.get(topic);
    if (schema) {
      const validate = this.ajv.compile(schema);
      if (!validate(message)) {
        throw new Error(`Invalid message for topic ${topic}: ${JSON.stringify(validate.errors)}`);
      }
    }

    await this.producer.send({
      topic,
      messages: [{
        key: key || message.userId || message.postId || message.commentId,
        value: JSON.stringify(message),
        headers: {
          'content-type': 'application/json',
          'timestamp': new Date().toISOString(),
          'x-trace-id': message.traceId || crypto.randomUUID()
        }
      }],
      compression: CompressionTypes.GZIP
    });
  }

  createConsumer(groupId: string, topics: string[]) {
    const consumer = this.kafka.consumer({ groupId });
    
    return {
      consumer,
      subscribe: async () => {
        await consumer.connect();
        for (const topic of topics) {
          await consumer.subscribe({ topic, fromBeginning: false });
        }
      },
      run: (handler: (message: any) => Promise<void>) => {
        return consumer.run({
          eachMessage: async ({ topic, partition, message }) => {
            try {
              if (!message.value) return;
              
              const parsedMessage = JSON.parse(message.value.toString());
              
              // Validate message against schema
              const schema = this.schemas.get(topic);
              if (schema) {
                const validate = this.ajv.compile(schema);
                if (!validate(parsedMessage)) {
                  console.error(`Invalid message for topic ${topic}:`, validate.errors);
                  // Send to dead letter queue
                  await this.publish(`${topic}.dlq`, {
                    originalMessage: parsedMessage,
                    error: validate.errors,
                    timestamp: new Date().toISOString()
                  });
                  return;
                }
              }
              
              await handler(parsedMessage);
              
              // Manual offset commit after successful processing
              await consumer.commitOffsets([{
                topic,
                partition,
                offset: (BigInt(message.offset) + BigInt(1)).toString()
              }]);
            } catch (error) {
              console.error(`Error processing message from topic ${topic}:`, error);
              // Send to dead letter queue
              await this.publish(`${topic}.dlq`, {
                originalMessage: JSON.parse(message.value!.toString()),
                error: (error as Error).message,
                timestamp: new Date().toISOString()
              });
            }
          }
        });
      },
      stop: async () => {
        await consumer.disconnect();
      }
    };
  }
}