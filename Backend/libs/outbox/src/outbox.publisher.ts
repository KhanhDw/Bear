import { Pool } from 'pg';
import { KafkaManager } from '../../kafka/src/kafka.manager.js';
import { logger } from '../../logger/src/structured.logger.js';

export interface OutboxEvent {
  id: number;
  aggregate_id: string;
  aggregate_type: string;
  event_type: string;
  payload: any;
  occurred_at: Date;
  processed_at?: Date;
  published_at?: Date;
  retries: number;
  max_retries: number;
  error_message?: string;
  trace_id?: string;
}

export class OutboxPublisher {
  constructor(
    private dbPool: Pool,
    private kafkaManager: KafkaManager,
    private pollInterval: number = 1000, // 1 second
    private batchSize: number = 10
  ) {}

  async saveEvent(aggregateId: string, aggregateType: string, eventType: string, payload: any, traceId?: string) {
    const query = `
      INSERT INTO outbox_events (aggregate_id, aggregate_type, event_type, payload, trace_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    
    const result = await this.dbPool.query(query, [aggregateId, aggregateType, eventType, payload, traceId]);
    return result.rows[0].id;
  }

  async startPolling() {
    console.log('Starting outbox publisher...');
    
    const poll = async () => {
      try {
        await this.processUnpublishedEvents();
      } catch (error) {
        console.error('Error in outbox polling:', error);
      }
      
      setTimeout(poll, this.pollInterval);
    };
    
    poll();
  }

  private async processUnpublishedEvents() {
    const query = `
      SELECT * FROM outbox_events 
      WHERE processed_at IS NULL 
        AND published_at IS NULL
        AND retries < max_retries
      ORDER BY occurred_at ASC
      LIMIT $1
    `;
    
    const result = await this.dbPool.query<OutboxEvent>(query, [this.batchSize]);
    const events = result.rows;
    
    for (const event of events) {
      try {
        await this.kafkaManager.publish(event.event_type, event.payload, event.aggregate_id);
        
        // Mark as published
        await this.markAsPublished(event.id);
      } catch (error) {
        console.error(`Failed to publish event ${event.id}:`, error);
        await this.markAsFailed(event.id, (error as Error).message);
      }
    }
  }

  private async markAsPublished(eventId: number) {
    const query = `
      UPDATE outbox_events 
      SET published_at = CURRENT_TIMESTAMP, processed_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await this.dbPool.query(query, [eventId]);
  }

  private async markAsFailed(eventId: number, errorMessage: string) {
    const query = `
      UPDATE outbox_events 
      SET retries = retries + 1, error_message = $1
      WHERE id = $2
    `;
    await this.dbPool.query(query, [errorMessage, eventId]);
  }

  async replayFailedEvents() {
    const query = `
      UPDATE outbox_events 
      SET retries = 0, error_message = NULL, processed_at = NULL, published_at = NULL
      WHERE retries >= max_retries
    `;
    await this.dbPool.query(query);
  }
}