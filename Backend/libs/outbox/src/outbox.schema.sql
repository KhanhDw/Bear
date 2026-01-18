-- Create outbox table for event sourcing
CREATE TABLE outbox_events (
    id SERIAL PRIMARY KEY,
    aggregate_id VARCHAR(50) NOT NULL,
    aggregate_type VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    published_at TIMESTAMP NULL,
    retries INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    error_message TEXT,
    trace_id VARCHAR(50)
);

-- Indexes for efficient querying
CREATE INDEX idx_outbox_events_unprocessed ON outbox_events (processed_at, published_at) 
WHERE processed_at IS NULL AND published_at IS NULL;
CREATE INDEX idx_outbox_events_aggregate ON outbox_events (aggregate_id, aggregate_type);
CREATE INDEX idx_outbox_events_type ON outbox_events (event_type);
CREATE INDEX idx_outbox_events_trace_id ON outbox_events (trace_id);