ranking-consumer/
└── src/
├── index.ts # bootstrap consumer
├── consumer.ts
│
├── handlers/
│ ├── post-created.handler.ts
│ ├── vote-updated.handler.ts
│ └── comment-created.handler.ts
│
├── services/
│ ├── ranking.service.ts
│ └── feed-updater.service.ts
│
├── infra/
│ ├── redis.ts
│ └── kafka.ts
│
└── types/
└── events.ts
