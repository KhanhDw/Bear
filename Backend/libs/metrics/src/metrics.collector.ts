import client from 'prom-client';
import { logger } from '../../logger/src/structured.logger.js';

export class MetricsCollector {
  private httpRequestDuration: client.Histogram<string>;
  private httpRequestTotal: client.Counter<string>;
  private dbConnections: client.Gauge<string>;
  private kafkaLag: client.Gauge<string>;
  private activeUsers: client.Gauge<string>;

  constructor() {
    // HTTP request duration histogram
    this.httpRequestDuration = new client.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code', 'service'],
      buckets: [0.1, 0.5, 1, 2, 5, 10]
    });

    // HTTP request counter
    this.httpRequestTotal = new client.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code', 'service']
    });

    // Database connections gauge
    this.dbConnections = new client.Gauge({
      name: 'db_connections',
      help: 'Number of database connections',
      labelNames: ['pool', 'service']
    });

    // Kafka lag gauge
    this.kafkaLag = new client.Gauge({
      name: 'kafka_consumer_lag',
      help: 'Kafka consumer lag',
      labelNames: ['consumer_group', 'topic', 'service']
    });

    // Active users gauge
    this.activeUsers = new client.Gauge({
      name: 'active_users',
      help: 'Number of active users',
      labelNames: ['service']
    });

    // Register metrics collection
    this.registerMetricsCollection();
  }

  observeHttpRequest(method: string, route: string, statusCode: number, duration: number, service: string) {
    this.httpRequestDuration.labels(method, route, statusCode.toString(), service).observe(duration);
    this.httpRequestTotal.labels(method, route, statusCode.toString(), service).inc();
  }

  setDbConnections(poolName: string, connections: number, service: string) {
    this.dbConnections.labels(poolName, service).set(connections);
  }

  setKafkaLag(consumerGroup: string, topic: string, lag: number, service: string) {
    this.kafkaLag.labels(consumerGroup, topic, service).set(lag);
  }

  setActiveUsers(count: number, service: string) {
    this.activeUsers.labels(service).set(count);
  }

  private registerMetricsCollection() {
    // Collect default Node.js metrics
    client.collectDefaultMetrics({
      register: client.register,
      prefix: 'node_'
    });

    // Custom metrics collection
    setInterval(() => {
      // Collect custom metrics periodically
      this.collectCustomMetrics();
    }, 10000); // Every 10 seconds
  }

  private collectCustomMetrics() {
    // Example: collect memory usage
    const memoryUsage = process.memoryUsage();
    client.register.getSingleMetricAsString('process_heap_bytes')
      .then(heapSize => {
        // Process heap size metric
      })
      .catch(err => {
        logger.error('Error collecting memory metrics', err);
      });
  }

  getMetrics() {
    return client.register.metrics();
  }
}

export const metricsCollector = new MetricsCollector();