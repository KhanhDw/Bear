# Bear Social - Production Operations Runbook

## 1. System Overview

Bear Social is a microservices-based social platform using:
- Node.js + Fastify services
- PostgreSQL per service
- Kafka for event streaming
- Redis for caching
- API Gateway
- Docker Compose for runtime

All services expose:
```
/health
/ready
/metrics
```

All requests propagate:
```
x-user-id
x-trace-id
```

## 2. Scaling Guide

### 2.1 Horizontal Scaling

Each service can be scaled independently.

With Docker Compose:

```bash
docker-compose up -d --scale post-service=3
```

Guidelines:

| Service      | Scale By         |
| ------------ | ---------------- |
| Gateway      | RPS              |
| Post         | Write throughput |
| Feed         | Read throughput  |
| Search       | Query latency    |
| Notification | Event lag        |

Monitor:
* Request/sec
* P95 latency
* Kafka consumer lag
* DB pool usage

### 2.2 Vertical Scaling

Adjust resources in compose:

```yaml
deploy:
  resources:
    limits:
      cpus: "1.0"
      memory: 1024M
```

Increase DB pools:

```ts
max: 30
idle: 10
```

Redis:
* Increase memory.
* Enable eviction policy: `allkeys-lru`.

## 3. Monitoring & Alerts

### 3.1 Critical Alerts

| Alert              | Threshold |
| ------------------ | --------- |
| Kafka consumer lag | > 1000    |
| HTTP 5xx           | > 5%      |
| Gateway latency    | > 1s      |
| DB pool exhausted  | > 90%     |
| Memory             | > 80%     |
| CPU                | > 85%     |

### 3.2 Health Checks

Verify:

```bash
curl http://gateway:8080/health
curl http://post-service:3003/ready
```

Kafka:

```bash
kafka-consumer-groups.sh --bootstrap-server kafka:9092 --describe --group post-service
```

Postgres:

```sql
SELECT * FROM pg_stat_activity;
```

Redis:

```bash
redis-cli info memory
```

## 4. Incident Response

### 4.1 Incident Flow

1. Detect alert.
2. Identify affected service.
3. Check health endpoints.
4. Inspect logs with traceId.
5. Check Kafka lag.
6. Check DB connections.
7. Apply mitigation.
8. Verify recovery.
9. Write incident report.

### 4.2 Debug Commands

Logs:

```bash
docker logs post-service --tail=200
```

Kafka lag:

```bash
kafka-consumer-groups.sh --bootstrap-server kafka:9092 --describe --group feed-service
```

DB slow queries:

```sql
SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;
```

Redis keys:

```bash
redis-cli --scan
```

## 5. Recovery Procedures

### 5.1 Service Recovery

Restart:

```bash
docker-compose restart post-service
```

Full reset:

```bash
docker-compose up -d --force-recreate post-service
```

Verify:

```bash
curl /health
curl /metrics
```

### 5.2 Kafka Recovery

Check broker:

```bash
docker logs kafka
```

Reset offsets:

```bash
kafka-consumer-groups.sh --bootstrap-server kafka:9092 --group feed-service --reset-offsets --to-latest --execute
```

Replay outbox:

```sql
UPDATE outbox_events SET status='PENDING' WHERE status='FAILED';
```

### 5.3 Database Recovery

Backup:

```bash
pg_dump -U user db > backup.sql
```

Restore:

```bash
psql db < backup.sql
```

Check integrity:

```sql
SELECT COUNT(*) FROM posts;
```

Vacuum:

```sql
VACUUM ANALYZE;
```

### 5.4 Redis Recovery

Flush cache:

```bash
redis-cli FLUSHALL
```

Restart:

```bash
docker-compose restart redis
```

## 6. Deployment & Rollback

Deploy:

```bash
docker-compose pull
docker-compose up -d
```

Rollback:

```bash
git checkout <tag>
docker-compose up -d --build
```

Drain gateway:
* Stop accepting traffic.
* Wait inflight complete.

## 7. Data Consistency Operations

### 7.1 Outbox Monitoring

Check pending:

```sql
SELECT COUNT(*) FROM outbox_events WHERE status='PENDING';
```

Replay:

```sql
UPDATE outbox_events SET status='PENDING' WHERE status='FAILED';
```

### 7.2 Saga Recovery

Detect broken saga:

```sql
SELECT * FROM saga_state WHERE status='FAILED';
```

Apply compensation:
* Delete orphan posts.
* Revert feed entries.
* Remove index rows.

## 8. Security Incidents

Token leak:
* Rotate JWT secret.
* Invalidate refresh tokens.
* Clear redis sessions.

Attack:
* Enable stricter rate limit.
* Block IP.
* Inspect logs.

## 9. Performance Debugging

Check P95:

```bash
curl /metrics | grep http_request_duration
```

Check slow endpoints.

Profile:
* CPU.
* Memory.
* Event loop delay.

## 10. Environment Management

Separate:

```
.env.dev
.env.staging
.env.prod
```

Never mix secrets.

## 11. Checklist

Before production:

* Health ok
* Kafka lag 0
* DB pool < 70%
* Redis memory < 70%
* All services reachable
* Logs clean