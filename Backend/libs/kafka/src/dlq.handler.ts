import { KafkaManager } from './kafka.manager.js';

export class DeadLetterQueueHandler {
  constructor(private kafka: KafkaManager) {}

  async sendToDLQ(
    topic: string,
    payload: any,
    error: unknown
  ) {
    await this.kafka.publish(`${topic}.dlq`, {
      originalTopic: topic,
      payload,
      error: String(error),
      timestamp: new Date().toISOString(),
      retryCount: (payload?.retryCount ?? 0) + 1
    });
  }

  async startDLQConsumer() {
    await this.kafka.consume(
      'dlq-processor-group',
      [
        'user.created.dlq',
        'post.created.dlq',
        'comment.created.dlq',
        'vote.created.dlq'
      ],
      async (message) => {
        console.error('[DLQ]', message);

        // TODO:
        // - log to monitoring
        // - alert ops
        // - manual reprocess
      }
    );
  }
}
