# Bear Social Network - Production-Ready Backend

## Overview

Bear Social Network is a comprehensive microservices-based social platform built with Node.js, Fastify, PostgreSQL, Kafka, and Redis. This implementation has been hardened and productionized with enterprise-grade features.

## Architecture Components

### Services
- **Gateway** (Port 8080): API Gateway with JWT validation, rate limiting, circuit breakers, and header propagation
- **Auth Service** (Port 3001): Authentication and authorization service
- **User Service** (Port 3002): User management and profiles
- **Post Service** (Port 3003): Content creation and management
- **Comment Service** (Port 3004): Comments and discussions
- **Vote Service** (Port 3005): Likes, dislikes, and voting
- **Feed Service** (Port 3006): Personalized content feeds
- **Notification Service** (Port 3007): Real-time notifications
- **Messaging Service** (Port 3008): Private and group messaging
- **Media Service** (Port 3009): Media upload and storage
- **Group Service** (Port 3010): Community and group management
- **Search Service** (Port 3011): Full-text search capabilities
- **Analytics Service** (Port 3012): User engagement and content analytics
- **Moderation Service** (Port 3013): Content moderation and reporting

### Infrastructure
- **PostgreSQL**: One database per service for data isolation
- **Kafka**: Event-driven communication between services
- **Redis**: Caching and session management
- **Docker Compose**: Local development environment

## Production Hardening Features

### 1. Health & Readiness Checks
Every service includes:
- `/health` - System health status
- `/ready` - Service readiness to accept traffic
- `/metrics` - Prometheus-compatible metrics

### 2. Observability
- Structured logging with correlation IDs
- Distributed tracing with x-trace-id propagation
- Prometheus metrics collection
- Error tracking and monitoring

### 3. Resilience
- Circuit breakers for service-to-service communication
- Retry policies with exponential backoff
- Graceful shutdown handling
- Timeout configurations
- Dead letter queue for failed messages

### 4. Security
- JWT-based authentication and authorization
- Refresh token rotation
- Rate limiting
- Input validation and sanitization
- Secure headers

### 5. Data Consistency
- Outbox pattern for event publishing
- Saga pattern for distributed transactions
- Manual Kafka offset management
- Schema validation for events

### 6. Caching
- Redis-based cache-aside pattern
- Configurable TTL and eviction policies
- Session management
- Cache invalidation strategies

## Running the System

### Prerequisites
- Docker and Docker Compose
- Node.js 18+

### Setup
1. Copy `.env.dev` to `.env`:
   ```bash
   cp .env.dev .env
   ```

2. Start the system:
   ```bash
   docker-compose up -d
   ```

3. The system will be available at:
   - Gateway: http://localhost:8080
   - Gateway Docs: http://localhost:8080/docs
   - Kafka UI: http://localhost:9092 (if using external tools)

### Environment Configuration
- Development: `.env.dev`
- Staging: `.env.staging`
- Production: `.env.prod`

## Service Communication

### HTTP via Gateway
All external requests go through the API Gateway which:
- Validates JWT tokens
- Propagates x-trace-id and x-user-id headers
- Implements rate limiting
- Applies circuit breakers

### Async via Kafka
Services communicate asynchronously through Kafka topics:
- `user.created` - User registration events
- `post.created` - Post creation events
- `comment.created` - Comment creation events
- `vote.created` - Voting events
- Dead letter queues for failed messages

## Operations Guide

### Scaling
Each service can be scaled independently:
```bash
docker-compose up -d --scale post-service=3
```

### Monitoring
- Health endpoints: `GET /health`
- Metrics: `GET /metrics`
- Logs: Check Docker container logs

### Recovery
- Service restart: `docker-compose restart service-name`
- Database backup: Use PostgreSQL dump/restore
- Kafka replay: Reset consumer group offsets

## Security Best Practices

1. Rotate JWT secrets regularly
2. Use strong passwords for databases
3. Implement network segmentation
4. Monitor for suspicious activities
5. Regular security audits

## Performance Tuning

1. Adjust database connection pools
2. Optimize Redis memory usage
3. Tune Kafka partitions and replication
4. Configure appropriate resource limits
5. Monitor and optimize slow queries

## Troubleshooting

Common issues and solutions:

- **Service not responding**: Check health endpoints and logs
- **Kafka lag**: Monitor consumer groups and increase partitions if needed
- **Database slow queries**: Check pg_stat_statements
- **Memory issues**: Monitor resource usage and adjust limits
- **Authentication failures**: Verify JWT secrets are synchronized

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your changes with proper tests
4. Submit a pull request

## License

This project is licensed under the MIT License.