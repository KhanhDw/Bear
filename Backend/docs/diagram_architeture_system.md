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
