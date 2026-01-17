# Bear Social Media Platform - Backend System Architecture

## Overview
The Bear Social Media Platform is a comprehensive microservices-based application designed for social networking functionality. The system follows a modern microservices architecture with an API Gateway pattern, event-driven communication using Kafka, and individual databases per service.

## System Architecture

### 1. API Gateway
The gateway service acts as the entry point for all client requests and provides:
- Request routing to appropriate microservices
- Cross-cutting concerns (CORS, security headers, rate limiting)
- Authentication and authorization (JWT-based)
- Health monitoring for the entire system
- Centralized logging and error handling

### 2. Microservices Architecture

#### Post Service (`post-service`)
- **Port**: 3003
- **Database**: PostgreSQL (bear_post_service)
- **Functionality**:
  - Complete CRUD operations for posts
  - Post creation, retrieval, updates, and deletion
  - Integration with vote service for upvotes/downvotes
  - Event publishing via Kafka for post-related activities
  - Health check endpoints
- **Database Schema**: Contains posts table with indexing for performance

#### User Service (`user-service`)
- **Port**: 3001
- **Database**: PostgreSQL (bear_user_service)
- **Functionality**:
  - Complete CRUD operations for users
  - User registration and profile management
  - Password hashing with bcrypt
  - Email/username uniqueness validation
  - Event publishing via Kafka for user-related activities
  - Health check endpoints
- **Database Schema**: Contains users table with proper indexing

#### Comment Service (`comment-service`)
- **Port**: 3002
- **Database**: PostgreSQL (bear_comment_service)
- **Functionality**:
  - Full CRUD operations for comments
  - Support for querying comments by post or user
  - Threaded comment support
  - Event publishing via Kafka for comment-related activities
  - Health check endpoints
- **Database Schema**: Contains comments table with proper indexing

#### Vote Service (`vote-service`)
- **Port**: (Not explicitly defined, accessed via gateway)
- **Database**: PostgreSQL (bear_vote_service)
- **Functionality**:
  - Voting system supporting upvotes/downvotes
  - Support for voting on posts and comments
  - Vote counting and aggregation
  - Prevention of duplicate votes
  - Real-time vote updates
  - Health check endpoints
- **Database Schema**: Contains votes table with unique constraints

#### Feed Service (`feed-service`)
- **Port**: (Not explicitly defined, accessed via gateway)
- **Database**: PostgreSQL (bear_feed_service)
- **Functionality**:
  - Personalized user feed aggregation
  - Algorithmic feed generation
  - Ability to add/remove posts from user feeds
  - Follow/unfollow functionality
  - Health check endpoints
- **Database Schema**: Contains feed table with proper indexing

#### Search Service (`search-service`)
- **Port**: 3004
- **Database**: PostgreSQL (bear_search_service)
- **Functionality**:
  - Full-text search across posts, users, and comments
  - PostgreSQL full-text search capabilities with pg_trgm extension
  - Support for filtering by entity type
  - Relevance scoring for search results
  - Real-time search index updates via Kafka
  - Health check endpoints
- **Database Schema**: Contains search_index table with GIN indexing

### 3. Infrastructure Services

#### Database Layer
- **PostgreSQL**: Used by all microservices with individual databases per service
- **Connection pooling**: Implemented for optimal database performance
- **Migration scripts**: SQL files for database setup and initialization

#### Message Queue
- **Apache Kafka**: Event-driven communication between services
- **Event producers**: Each service publishes domain events
- **Event consumers**: Services subscribe to relevant events
- **Real-time updates**: Synchronization between services without tight coupling

#### Container Orchestration
- **Docker**: Containerization of all services
- **Docker Compose**: Local development and deployment orchestration
- **Multi-profile support**: Separate infrastructure and API profiles
- **Health checks**: Built-in service health monitoring

## Communication Patterns

### Synchronous Communication
- Client ↔ Gateway ↔ Microservice (REST API)
- Gateway performs HTTP proxying to individual services
- Request/response pattern for immediate operations

### Asynchronous Communication
- Microservice → Kafka → Microservice (Event Streaming)
- Event-driven architecture for eventual consistency
- Decoupled services with fault tolerance

## Security Features
- JWT-based authentication and authorization
- CORS configuration with origin control
- Helmet security headers
- Rate limiting to prevent abuse
- Input validation and sanitization
- Secure password hashing

## Deployment Architecture
```
┌─────────────┐    ┌────────────-─┐     ┌─────────────┐
│   Client    │    │   Gateway     │    │ Infrastructure │
│  (Frontend) │◄──►│ (Load Balancer│◄──►│ • PostgreSQL │
└─────────────┘    │  & Router)   │     │ • Kafka      │
                   └─────────────┘      │ • Redis      │
                         │              └─────────────┘
                         ▼
        ┌───────────────────────────────────────────┐
        │              Microservices                │
        ├─────────────┬─────────────┬────────────---┤
        │ Post Service│ User Service│Comment Service|
        │    3003     │    3001     │   3002        │
        ├─────────────┼─────────────┼────────────---┤
        │ Vote Service│ Feed Service│Search Service │
        │             │             │   3004        │
        └─────────────┴─────────────┴────────────---┘
```

## Development Features
- Hot reloading for development
- Comprehensive logging with pino
- Health check endpoints for monitoring
- Environment-based configuration
- Structured error handling
- API schema validation

## Technology Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Fastify for all microservices
- **Database**: PostgreSQL for persistence
- **Message Queue**: Apache Kafka
- **Containerization**: Docker & Docker Compose
- **Security**: JWT, bcrypt, Helmet
- **Testing**: Jest (implied from architecture)
- **Logging**: Pino with pino-pretty

This architecture provides a scalable, maintainable, and resilient foundation for the Bear Social Media Platform, supporting all core social networking features while maintaining separation of concerns and enabling independent service evolution.
