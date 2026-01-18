import { KafkaManager } from './kafka.manager.js';

export class DeadLetterQueueHandler {
  constructor(private kafkaManager: KafkaManager) {}

  async handlePoisonMessage(topic: string, message: any, error: string) {
    const dlqTopic = `${topic}.dlq`;
    
    await this.kafkaManager.publish(dlqTopic, {
      originalTopic: topic,
      originalMessage: message,
      error,
      timestamp: new Date().toISOString(),
      retryCount: message.retryCount ? message.retryCount + 1 : 1
    });
  }

  async setupDLQProcessor() {
    const consumer = this.kafkaManager.createConsumer(
      'dlq-processor-group',
      ['user.created.dlq', 'post.created.dlq', 'comment.created.dlq', 'vote.created.dlq']
    );

    await consumer.subscribe();
    
    await consumer.run(async (message) => {
      console.error('Poison message detected:', message);
      // Log to monitoring system, alert ops team
      // Could implement manual intervention workflow here
    });

    return consumer;
  }
}