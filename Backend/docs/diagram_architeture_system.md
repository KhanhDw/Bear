social-feed-platform/
│
├── gateway/
│ └── src/
│ | └── plugins/
| | | ├── auth.ts
| | | ├── rate-limit.ts
| | | └── tracing.ts
│ | ├── app.ts
│ | └── server.ts
│
├── services/ # HTTP-facing services
│ ├── user-service/
│ ├── post-service/
| | | ├── src/
| | | │ ├── app.ts # build Fastify instance
| | | │ ├── server.ts # listen(), process signals
| | | │ │
| | | │ ├── config/ # env + runtime config
| | | │ │ ├── env.ts
| | | │ │ ├── mongo.ts
| | | │ │ ├── redis.ts
| | | │ │ └── kafka.ts
| | | │ │
| | | │ ├── modules/ # DOMAIN-DRIVEN
| | | │ │ └── post/
| | | │ │ │ ├── post.routes.ts # HTTP routes only
| | | │ │ │ ├── post.controller.ts # request/response mapping
| | | │ │ │ ├── post.service.ts # business logic
| | | │ │ │ ├── post.repository.ts # MongoDB access
| | | │ │ │ ├── post.cache.ts # Redis logic
| | | │ │ │ ├── post.events.ts # Kafka producer
| | | │ │ │ ├── post.schema.ts # validation schemas
| | | │ │ │ ├── post.types.ts
| | | │ │ │ └── **tests**/
| | | │ │
| | | │ ├── shared/ # cross-module utilities
| | | │ │ ├── errors/
| | | │ │ ├── pagination.ts
| | | │ │ └── circuit-breaker.ts
| | | │ │
| | | │ ├── plugins/ # Fastify plugins
| | | │ │ ├── auth.plugin.ts
| | | │ │ ├── redis.plugin.ts
| | | │ │ └── metrics.plugin.ts
| | | │ │
| | | │ └── health/
| | | │ | ├── health.routes.ts
| | | │ | └── readiness.ts
| | | │
| | | ├── Dockerfile
| | | ├── package.json
| | | └── tsconfig.json
│ ├── comment-service/
│ ├── vote-service/
│ ├── feed-service/
│ └── search-service/
│
├── consumers/ # Kafka consumers (NO HTTP)
│ ├── ranking-consumer/
│ ├── cache-invalidator/
│ ├── analytics-consumer/
│ └── notification-consumer/
│
├── libs/ # Shared libraries (versioned!)
│ ├── kafka/
│ ├── redis/
│ ├── logger/
│ ├── auth/
│ ├── tracing/
│ └── validation/
│
├── infra/ # IaC / manifests
│ ├── docker/
│ ├── k8s/
│ └── terraform/
│
├── scripts/ # one-off jobs, migrations, backfills
│
└── docs/ # ADRs, architecture decisions
