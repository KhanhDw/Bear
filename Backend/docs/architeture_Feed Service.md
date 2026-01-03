feed-service/
└── src/
├── modules/
│ └── feed/
│ ├── feed.routes.ts
│ ├── feed.controller.ts
│ ├── feed.service.ts
│ │
│ ├── builders/ # rebuild feeds
│ │ ├── hot.builder.ts
│ │ ├── new.builder.ts
│ │ └── user.builder.ts
│ │
│ ├── ranking/
│ │ ├── hot-score.ts
│ │ └── time-decay.ts
│ │
│ ├── feed.cache.ts
│ └── feed.types.ts
