<!-- example with a post service - architeture  -->

post-service/
│
├── src/
│ ├── app.ts # build Fastify instance
│ ├── server.ts # listen(), process signals
│ │
│ ├── config/ # env + runtime config
│ │ ├── env.ts
│ │ ├── mongo.ts
│ │ ├── redis.ts
│ │ └── kafka.ts
│ │
│ ├── modules/ # DOMAIN-DRIVEN
│ │ └── post/
│ │ │ ├── post.routes.ts # HTTP routes only
│ │ │ ├── post.controller.ts # request/response mapping
│ │ │ ├── post.service.ts # business logic
│ │ │ ├── post.repository.ts # MongoDB access
│ │ │ ├── post.cache.ts # Redis logic
│ │ │ ├── post.events.ts # Kafka producer
│ │ │ ├── post.schema.ts # validation schemas
│ │ │ ├── post.types.ts
│ │ │ └── **tests**/
│ │
│ ├── shared/ # cross-module utilities
│ │ ├── errors/
│ │ ├── pagination.ts
│ │ └── circuit-breaker.ts
│ │
│ ├── plugins/ # Fastify plugins
│ │ ├── auth.plugin.ts
│ │ ├── redis.plugin.ts
│ │ └── metrics.plugin.ts
│ │
│ └── health/
│ | ├── health.routes.ts
│ | └── readiness.ts
│
├── Dockerfile
├── package.json
└── tsconfig.json
