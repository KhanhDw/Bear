services/
├── post-service/
│ └── src/modules/post/
│ | ├── post.routes.ts
│ | ├── post.controller.ts
│ | ├── post.service.ts
│ | ├── post.repository.ts
│ | └── post.events.ts
│
├── feed-service/
│ └── src/modules/feed/
│ | ├── feed.routes.ts
│ | ├── feed.controller.ts
│ | ├── feed.service.ts
│ | └── feed.cache.ts
│
consumers/
└── ranking-consumer/
| └── src/
| | ├── handlers/post-created.handler.ts
| | ├── services/ranking.service.ts
| | └── infra/redis.ts
