# SYSTEM DESIGN PLAN – SOCIAL FEED PLATFORM (COMPLETE & PRODUCTION-READY)

---

## 1. BUSINESS CONTEXT & REQUIREMENTS

### 1.1 Business Scenario

Nền tảng social feed tương tự Reddit cho phép:

- Người dùng tạo posts, comments
- Vote up/down nội dung
- Browse feed được ranked theo thuật toán
- Real-time hoặc near-real-time feed updates

### 1.2 Scale Requirements

- **Users**: 10M DAU (Daily Active Users)
- **Posts**: 1M posts/day (~12 posts/second)
- **Votes**: 100M votes/day (~1,200 votes/second)
- **Comments**: 5M comments/day (~58 comments/second)
- **Feed requests**: 500M requests/day (~5,800 requests/second)

### 1.3 Performance SLOs

| Metric                 | Target      | Critical    |
| ---------------------- | ----------- | ----------- |
| Feed load (cache hit)  | p95 < 100ms | p99 < 200ms |
| Feed load (cache miss) | p95 < 300ms | p99 < 500ms |
| Post creation          | p95 < 200ms | p99 < 400ms |
| Vote action            | p95 < 150ms | p99 < 300ms |
| Feed freshness         | < 5s lag    | < 30s lag   |
| Availability           | 99.9%       | 99.5%       |

### 1.4 Business Constraints

- 90% read, 10% write workload
- Vote spam prevention
- Content moderation ready
- Scalable to 100M+ users

---

## 2. DOMAIN MODEL & DATA SCHEMA

### 2.1 User Service

**PostgreSQL Schema:**

```sql
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

CREATE TABLE user_follows (
    follower_id UUID REFERENCES users(user_id),
    following_id UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id),
    INDEX idx_follower (follower_id),
    INDEX idx_following (following_id)
);
```

**Redis Cache:**

```
user:profile:{user_id} → JSON (TTL: 1 hour)
user:following:{user_id} → Set<user_id> (TTL: 10 minutes)
```

---

### 2.2 Post Service

**MongoDB Schema:**

```javascript
{
  _id: ObjectId,
  post_id: "uuid-v4",
  user_id: "uuid",
  title: "string (max 300 chars)",
  content: "string (max 40000 chars)",
  media_urls: ["url1", "url2"],
  created_at: ISODate,
  updated_at: ISODate,
  is_deleted: false,

  // Denormalized for read performance
  author: {
    user_id: "uuid",
    username: "string",
    avatar_url: "url"
  },

  // Indexes
  indexes: [
    { post_id: 1 },
    { user_id: 1, created_at: -1 },
    { created_at: -1 },
    { is_deleted: 1, created_at: -1 }
  ]
}
```

**Redis Cache:**

```
post:detail:{post_id} → JSON (TTL: 5 minutes)
post:hot → Sorted Set (score = hot_score, TTL: 1 minute)
```

---

### 2.3 Comment Service

**MongoDB Schema:**

```javascript
{
  _id: ObjectId,
  comment_id: "uuid-v4",
  post_id: "uuid",
  user_id: "uuid",
  parent_comment_id: "uuid | null", // for nested comments
  content: "string (max 10000 chars)",
  created_at: ISODate,
  updated_at: ISODate,
  is_deleted: false,

  author: {
    user_id: "uuid",
    username: "string",
    avatar_url: "url"
  },

  indexes: [
    { comment_id: 1 },
    { post_id: 1, created_at: -1 },
    { user_id: 1, created_at: -1 },
    { parent_comment_id: 1 }
  ]
}
```

**Redis Cache:**

```
comment:list:{post_id} → JSON Array (TTL: 2 minutes)
comment:count:{post_id} → Integer (TTL: 5 minutes)
```

---

### 2.4 Vote Service

**PostgreSQL Schema:**

```sql
CREATE TABLE votes (
    vote_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id),
    target_id UUID NOT NULL, -- post_id or comment_id
    target_type VARCHAR(20) NOT NULL, -- 'post' or 'comment'
    vote_type SMALLINT NOT NULL, -- 1: upvote, -1: downvote
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, target_id, target_type),
    INDEX idx_target (target_id, target_type),
    INDEX idx_user (user_id, created_at)
);

CREATE TABLE vote_counts (
    target_id UUID PRIMARY KEY,
    target_type VARCHAR(20) NOT NULL,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    score INTEGER DEFAULT 0, -- upvotes - downvotes
    updated_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_score (score DESC)
);
```

**Redis Cache:**

```
vote:count:{target_id} → Hash {upvotes, downvotes, score} (TTL: 30s)
vote:user:{user_id}:{target_id} → Integer (1 or -1, TTL: 1 hour)
```

---

### 2.5 Feed Service

**Redis Data Structures:**

```
feed:user:{user_id} → Sorted Set (score = ranking_score, members = post_id)
feed:global:hot → Sorted Set (top 1000 posts, TTL: 1 minute)
feed:global:new → Sorted Set (top 1000 posts by time)
feed:global:top:{timeframe} → Sorted Set (hour/day/week/month/year)
```

**Ranking Algorithm (Hot Score):**

```javascript
function calculateHotScore(upvotes, downvotes, createdAt) {
  const score = upvotes - downvotes;
  const ageInHours = (Date.now() - createdAt) / (1000 * 60 * 60);
  const gravity = 1.8; // Reddit uses 1.8

  return score / Math.pow(ageInHours + 2, gravity);
}
```

---

## 3. SYSTEM ARCHITECTURE

### 3.1 High-Level Architecture

```
┌─────────────┐
│   Clients   │ (Web/Mobile)
└──────┬──────┘
       │
┌──────▼──────────────────────────────────────┐
│          API Gateway / Load Balancer        │
│          (Kong / Nginx / AWS ALB)           │
└──────┬──────────────────────────────────────┘
       │
       ├──────┬─────────┬─────────┬────────┬──────────┐
       │      │         │         │        │          │
   ┌───▼──┐ ┌▼────┐ ┌──▼───┐ ┌──▼───┐ ┌──▼────┐ ┌──▼────┐
   │ User │ │Post │ │Comment│ │Vote  │ │Feed   │ │Search │
   │Service│ │Svc  │ │Svc    │ │Svc   │ │Svc    │ │Svc    │
   └───┬──┘ └┬────┘ └──┬───┘ └──┬───┘ └──┬────┘ └──┬────┘
       │     │         │         │        │          │
       │     │         │         │        │          │
       ├─────┴─────────┴─────────┴────────┴──────────┤
       │                                              │
   ┌───▼──────────────────────────────────────────┐  │
   │           Kafka Event Streaming              │  │
   │  Topics: user.*, post.*, comment.*, vote.*  │  │
   └───┬──────────────────────────────────────────┘  │
       │                                              │
       ├──────────────┬──────────────┬───────────────┤
       │              │              │               │
   ┌───▼────────┐ ┌──▼─────────┐ ┌─▼──────────┐ ┌──▼────────┐
   │  Ranking   │ │ Analytics  │ │  Cache     │ │Notification│
   │  Consumer  │ │  Consumer  │ │Invalidator │ │  Consumer  │
   └───┬────────┘ └──┬─────────┘ └─┬──────────┘ └──┬────────┘
       │             │              │               │
       │             │              │               │
┌──────┴─────────────┴──────────────┴───────────────┴──────┐
│                    Data Layer                             │
├──────────────┬────────────────┬──────────────┬───────────┤
│  PostgreSQL  │   MongoDB      │    Redis     │Elasticsearch│
│  (Users,     │  (Posts,       │  (Cache,     │  (Search)   │
│   Votes)     │   Comments)    │   Feed)      │             │
└──────────────┴────────────────┴──────────────┴────────────┘
```

---

### 3.2 Service Breakdown

#### **User Service**

- **Responsibilities:**
  - Authentication (JWT)
  - User registration, login, profile management
  - Follow/unfollow users
- **Tech Stack:** Node.js + Fastify + PostgreSQL + Redis
- **Endpoints:**
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/users/:userId`
  - `PUT /api/users/:userId`
  - `POST /api/users/:userId/follow`
  - `DELETE /api/users/:userId/follow`

#### **Post Service**

- **Responsibilities:**
  - CRUD posts
  - Upload media
  - Soft delete
- **Tech Stack:** Node.js + Fastify + MongoDB + Redis
- **Endpoints:**
  - `POST /api/posts`
  - `GET /api/posts/:postId`
  - `PUT /api/posts/:postId`
  - `DELETE /api/posts/:postId`
  - `GET /api/users/:userId/posts`

#### **Comment Service**

- **Responsibilities:**
  - CRUD comments
  - Nested comments support
  - Comment threading
- **Tech Stack:** Node.js + Fastify + MongoDB + Redis
- **Endpoints:**
  - `POST /api/posts/:postId/comments`
  - `GET /api/posts/:postId/comments`
  - `PUT /api/comments/:commentId`
  - `DELETE /api/comments/:commentId`

#### **Vote Service**

- **Responsibilities:**
  - Upvote/downvote posts and comments
  - Vote deduplication
  - Aggregate vote counts
- **Tech Stack:** Node.js + Fastify + PostgreSQL + Redis
- **Endpoints:**
  - `POST /api/votes` (body: {target_id, target_type, vote_type})
  - `DELETE /api/votes/:voteId`
  - `GET /api/votes/:targetId/count`

#### **Feed Service**

- **Responsibilities:**
  - Generate personalized feeds
  - Global feeds (hot, new, top)
  - Pagination
- **Tech Stack:** Node.js + Fastify + Redis + MongoDB (fallback)
- **Endpoints:**
  - `GET /api/feed/hot`
  - `GET /api/feed/new`
  - `GET /api/feed/top/:timeframe`
  - `GET /api/feed/user/:userId` (personalized)

#### **Search Service** (Optional Phase 2)

- **Responsibilities:**
  - Full-text search posts/comments
  - Fuzzy search users
- **Tech Stack:** Node.js + Elasticsearch
- **Endpoints:**
  - `GET /api/search?q={query}&type={post|comment|user}`

---

## 4. DATA FLOW DETAILS

### 4.1 Write Flow Example: User Creates Post

```
┌──────┐    1. POST /api/posts           ┌────────────┐
│Client├──────────────────────────────────►Post Service│
└──────┘                                  └─────┬──────┘
                                                │
                                    2. Write to MongoDB
                                                │
                                          ┌─────▼──────┐
                                          │  MongoDB   │
                                          └─────┬──────┘
                                                │
                                    3. Publish event
                                                │
                                          ┌─────▼──────┐
                                          │   Kafka    │
                                          │ Topic:     │
                                          │post.created│
                                          └─────┬──────┘
                                                │
                    ┌───────────────────────────┼───────────────────┐
                    │                           │                   │
            ┌───────▼────────┐      ┌──────────▼────────┐  ┌──────▼──────┐
            │Ranking Consumer│      │Cache Invalidator  │  │Analytics Svc│
            └───────┬────────┘      └──────────┬────────┘  └─────────────┘
                    │                          │
        4. Calculate score         5. Invalidate cache
                    │                          │
            ┌───────▼────────┐      ┌──────────▼────────┐
            │  Redis Feed    │      │   Redis Cache     │
            │  (Sorted Set)  │      │   (Flush keys)    │
            └────────────────┘      └───────────────────┘
```

**Code Example (Post Service):**

```typescript
// POST /api/posts
async function createPost(req: FastifyRequest, reply: FastifyReply) {
  const { title, content, media_urls } = req.body;
  const userId = req.user.userId; // from JWT

  // 1. Validate input
  if (!title || title.length > 300) {
    return reply.code(400).send({ error: "Invalid title" });
  }

  // 2. Get user info (denormalize)
  const user = await getUserFromCache(userId);

  // 3. Create post in MongoDB
  const post = {
    post_id: uuidv4(),
    user_id: userId,
    title,
    content,
    media_urls,
    created_at: new Date(),
    updated_at: new Date(),
    is_deleted: false,
    author: {
      user_id: user.user_id,
      username: user.username,
      avatar_url: user.avatar_url,
    },
  };

  await db.collection("posts").insertOne(post);

  // 4. Publish event to Kafka (fire and forget)
  await kafkaProducer.send({
    topic: "post.created",
    messages: [
      {
        key: post.post_id,
        value: JSON.stringify({
          post_id: post.post_id,
          user_id: userId,
          created_at: post.created_at.toISOString(),
          title: post.title,
        }),
      },
    ],
  });

  // 5. Return immediately (don't wait for consumers)
  return reply.code(201).send({ post_id: post.post_id });
}
```

---

### 4.2 Read Flow Example: User Loads Feed

```
┌──────┐   1. GET /api/feed/hot          ┌────────────┐
│Client├─────────────────────────────────►Feed Service│
└──────┘                                  └─────┬──────┘
                                                │
                                    2. Check Redis cache
                                                │
                                          ┌─────▼──────┐
                                          │   Redis    │
                                          │ feed:hot   │
                                          └─────┬──────┘
                                                │
                                    ┌───────────┴───────────┐
                                    │                       │
                            Cache HIT               Cache MISS
                                    │                       │
                    ┌───────────────▼───────┐      ┌────────▼────────┐
                    │ 3a. Get post IDs      │      │ 3b. Batch fetch │
                    │     from sorted set   │      │     from MongoDB│
                    └───────────┬───────────┘      └────────┬────────┘
                                │                           │
                    ┌───────────▼───────────────────────────▼─────┐
                    │ 4. Hydrate post details (batch query)       │
                    │    - Post content from MongoDB               │
                    │    - Vote counts from Redis/PostgreSQL      │
                    │    - Comment counts from Redis               │
                    └───────────┬─────────────────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │ 5. Return JSON array  │
                    │    to client          │
                    └───────────────────────┘
```

**Code Example (Feed Service):**

```typescript
// GET /api/feed/hot
async function getHotFeed(req: FastifyRequest, reply: FastifyReply) {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 25;
  const offset = (page - 1) * pageSize;

  // 1. Get post IDs from Redis sorted set
  const postIds = await redis.zrevrange(
    "feed:global:hot",
    offset,
    offset + pageSize - 1
  );

  if (postIds.length === 0) {
    // Cache miss: rebuild from DB
    postIds = await rebuildHotFeed();
  }

  // 2. Batch fetch post details
  const posts = await Promise.all(
    postIds.map((postId) => getPostWithMetadata(postId))
  );

  return reply.send({ posts, page, hasMore: posts.length === pageSize });
}

async function getPostWithMetadata(postId: string) {
  // Check cache first
  const cached = await redis.get(`post:detail:${postId}`);
  if (cached) return JSON.parse(cached);

  // Parallel fetch
  const [post, voteCount, commentCount] = await Promise.all([
    db.collection("posts").findOne({ post_id: postId }),
    getVoteCount(postId),
    getCommentCount(postId),
  ]);

  const result = {
    ...post,
    votes: voteCount,
    comments: commentCount,
  };

  // Cache for 5 minutes
  await redis.setex(`post:detail:${postId}`, 300, JSON.stringify(result));

  return result;
}
```

---

### 4.3 Write Flow Example: User Votes on Post

```
┌──────┐   1. POST /api/votes            ┌────────────┐
│Client├─────────────────────────────────►Vote Service│
└──────┘                                  └─────┬──────┘
                                                │
                                2. Check if user already voted
                                                │
                                          ┌─────▼──────┐
                                          │ PostgreSQL │
                                          │   votes    │
                                          └─────┬──────┘
                                                │
                            ┌───────────────────┴────────────────┐
                            │                                    │
                    Already voted                         New vote
                            │                                    │
            ┌───────────────▼────────┐          ┌───────────────▼────────┐
            │ 3a. Update vote        │          │ 3b. Insert new vote    │
            │     (upsert)           │          │                        │
            └───────────┬────────────┘          └───────────┬────────────┘
                        │                                   │
                        └───────────────┬───────────────────┘
                                        │
                        4. Update vote_counts table
                                        │
                                  ┌─────▼──────┐
                                  │ PostgreSQL │
                                  │vote_counts │
                                  └─────┬──────┘
                                        │
                        5. Publish event to Kafka
                                        │
                                  ┌─────▼──────┐
                                  │   Kafka    │
                                  │vote.updated│
                                  └─────┬──────┘
                                        │
                        ┌───────────────┴───────────────┐
                        │                               │
            ┌───────────▼────────┐          ┌──────────▼────────┐
            │Ranking Consumer    │          │Cache Invalidator  │
            │(recalculate score) │          │(flush vote cache) │
            └────────────────────┘          └───────────────────┘
```

**Code Example (Vote Service):**

```typescript
// POST /api/votes
async function createVote(req: FastifyRequest, reply: FastifyReply) {
  const { target_id, target_type, vote_type } = req.body;
  const userId = req.user.userId;

  // Validate
  if (!["post", "comment"].includes(target_type)) {
    return reply.code(400).send({ error: "Invalid target_type" });
  }
  if (![1, -1].includes(vote_type)) {
    return reply.code(400).send({ error: "Invalid vote_type" });
  }

  await db.transaction(async (trx) => {
    // 1. Upsert vote
    const existing = await trx("votes")
      .where({ user_id: userId, target_id, target_type })
      .first();

    if (existing) {
      // Update existing vote
      await trx("votes")
        .where({ vote_id: existing.vote_id })
        .update({ vote_type, updated_at: new Date() });

      // Adjust counts
      const delta = vote_type - existing.vote_type;
      if (delta !== 0) {
        await adjustVoteCount(trx, target_id, target_type, delta);
      }
    } else {
      // Insert new vote
      await trx("votes").insert({
        vote_id: uuidv4(),
        user_id: userId,
        target_id,
        target_type,
        vote_type,
        created_at: new Date(),
      });

      await adjustVoteCount(trx, target_id, target_type, vote_type);
    }
  });

  // 2. Publish event (async)
  await kafkaProducer.send({
    topic: "vote.updated",
    messages: [
      {
        key: target_id,
        value: JSON.stringify({
          target_id,
          target_type,
          user_id: userId,
          vote_type,
        }),
      },
    ],
  });

  return reply.code(200).send({ success: true });
}

async function adjustVoteCount(trx, targetId, targetType, delta) {
  const field = delta > 0 ? "upvotes" : "downvotes";
  await trx("vote_counts")
    .insert({
      target_id: targetId,
      target_type: targetType,
      [field]: Math.abs(delta),
      score: delta,
      updated_at: new Date(),
    })
    .onConflict(["target_id"])
    .merge({
      [field]: trx.raw(`?? + ?`, [field, Math.abs(delta)]),
      score: trx.raw(`score + ?`, [delta]),
      updated_at: new Date(),
    });
}
```

---

## 5. KAFKA EVENT DESIGN

### 5.1 Kafka Topics

| Topic             | Partitions | Retention | Purpose           |
| ----------------- | ---------- | --------- | ----------------- |
| `user.created`    | 3          | 7 days    | User registration |
| `user.updated`    | 3          | 7 days    | Profile changes   |
| `post.created`    | 10         | 30 days   | New posts         |
| `post.updated`    | 10         | 30 days   | Post edits        |
| `post.deleted`    | 10         | 30 days   | Post deletions    |
| `comment.created` | 10         | 30 days   | New comments      |
| `comment.deleted` | 10         | 30 days   | Comment deletions |
| `vote.updated`    | 10         | 7 days    | Vote changes      |

### 5.2 Event Schema Examples

**post.created:**

```json
{
  "event_id": "uuid",
  "event_type": "post.created",
  "timestamp": "2025-01-02T10:30:00Z",
  "data": {
    "post_id": "uuid",
    "user_id": "uuid",
    "title": "string",
    "created_at": "2025-01-02T10:30:00Z"
  }
}
```

**vote.updated:**

```json
{
  "event_id": "uuid",
  "event_type": "vote.updated",
  "timestamp": "2025-01-02T10:35:00Z",
  "data": {
    "target_id": "uuid",
    "target_type": "post",
    "user_id": "uuid",
    "vote_type": 1,
    "previous_vote_type": null
  }
}
```

### 5.3 Consumer Groups

| Consumer Group        | Topics                                | Purpose                |
| --------------------- | ------------------------------------- | ---------------------- |
| `ranking-updater`     | `post.created`, `vote.updated`        | Update feed rankings   |
| `cache-invalidator`   | `*.created`, `*.updated`, `*.deleted` | Invalidate Redis cache |
| `analytics-processor` | `*`                                   | Send to data warehouse |
| `notification-sender` | `comment.created`, `vote.updated`     | Push notifications     |

---

## 6. CACHING STRATEGY (DETAILED)

### 6.1 Cache Layers

**L1: Application Cache (In-Memory)**

- Hot user sessions (10-minute TTL)
- Rate limit counters

**L2: Redis Centralized Cache**

- Feed data
- Post details
- Vote counts
- User profiles

### 6.2 Cache Invalidation Patterns

**Time-based (TTL):**

```typescript
// Safety net for all cached data
await redis.setex(key, 300, value); // 5-minute default
```

**Event-based:**

```typescript
// Cache Invalidator Consumer
kafkaConsumer.on("message", async (message) => {
  const event = JSON.parse(message.value);

  switch (event.event_type) {
    case "post.updated":
      await redis.del(`post:detail:${event.data.post_id}`);
      await redis.del(`feed:user:${event.data.user_id}`);
      break;

    case "vote.updated":
      await redis.del(`vote:count:${event.data.target_id}`);
      await redis.del(`post:detail:${event.data.target_id}`);
      // Invalidate all feed caches (expensive but necessary)
      await redis.del("feed:global:hot");
      break;
  }
});
```

### 6.3 Cache Warming

**Scheduled Job (every 1 minute):**

```typescript
async function warmHotFeedCache() {
  // Fetch top 1000 posts by hot score
  const posts = await db.query(`
    SELECT p.post_id, vc.score, p.created_at
    FROM posts p
    JOIN vote_counts vc ON p.post_id = vc.target_id
    WHERE p.is_deleted = FALSE
    ORDER BY (vc.score / POW(EXTRACT(EPOCH FROM (NOW() - p.created_at)) / 3600 + 2, 1.8)) DESC
    LIMIT 1000
  `);

  // Update Redis sorted set
  const entries = posts.map((p) => ({
    score: calculateHotScore(p.score, p.created_at),
    member: p.post_id,
  }));

  await redis.zadd("feed:global:hot", ...entries.flat());
  await redis.expire("feed:global:hot", 120); // 2-minute TTL
}
```

---

## 7. CONSISTENCY & DATA INTEGRITY

### 7.1 Consistency Model

**Strong Consistency (PostgreSQL):**

- User authentication
- Vote records
- Vote counts (source of truth)

**Eventual Consistency (Redis + Kafka):**

- Feed rankings (lag < 5 seconds target)
- Cache data
- Analytics

### 7.2 Dealing with Inconsistencies

**Scenario: Vote count mismatch between PostgreSQL and Redis**

**Detection:**

```typescript
// Health check job (every 5 minutes)
async function checkVoteConsistency() {
  const samplePostIds = await redis.zrange("feed:global:hot", 0, 100);

  for (const postId of samplePostIds) {
    const redisCount = await redis.hget(`vote:count:${postId}`, "score");
    const dbCount = await db.query(
      "SELECT score FROM vote_counts WHERE target_id = ?",
      [postId]
    );

    if (Math.abs(redisCount - dbCount.score) > 5) {
      logger.warn("Vote count mismatch detected", {
        postId,
        redisCount,
        dbCount,
      });
      await syncVoteCount(postId);
    }
  }
}
```

**Resolution:**

```typescript
async function syncVoteCount(postId: string) {
  const dbCount = await db.query(
    "SELECT upvotes, downvotes, score FROM vote_counts WHERE target_id = ?",
    [postId]
  );

  await redis.hmset(`vote:count:${postId}`, {
    upvotes: dbCount.upvotes,
    downvotes: dbCount.downvotes,
    score: dbCount.score,
  });

  await redis.expire(`vote:count:${postId}`, 300);
}
```

---

## 8. FAILURE HANDLING (COMPREHENSIVE)

### 8.1 Service Failure Scenarios

| Failure            | Impact                | Mitigation                      |
| ------------------ | --------------------- | ------------------------------- |
| Redis down         | Feed slow, no cache   | Fallback to DB, circuit breaker |
| Kafka down         | Events not propagated | Producer buffer, retry queue    |
| Postgre down       | Votes/auth fail       | Read replicas, circuit breaker  |
| Mongo down         | Posts/comments fail   | Read replicas, degraded mode    |
| Consumer lag > 30s | Stale feed            | Alert, scale consumers          |

### 8.2 Circuit Breaker Implementation

```typescript
import CircuitBreaker from "opossum";

const redisBreaker = new CircuitBreaker(
  async (key) => {
    return await redis.get(key);
  },
  {
    timeout: 100, // 100ms
    errorThresholdPercentage: 50,
    resetTimeout: 10000, // 10s
  }
);

redisBreaker.fallback(() => {
  logger.warn("Redis circuit breaker opened, falling back to DB");
  return null; // Force cache miss
});

// Usage in Feed Service
async function getCachedPost(postId: string) {
  try {
    const cached = await redisBreaker.fire(`post:detail:${postId}`);
    if (cached) return JSON.parse(cached);
  } catch (err) {
    logger.error("Redis breaker failed", err);
  }

  // Fallback to DB
  return await db.collection("posts").findOne({ post_id: postId });
}
```

### 8.3 Kafka Producer Retry

```typescript
const producer = kafka.producer({
  retry: {
    initialRetryTime: 100,
    retries: 8,
    maxRetryTime: 30000,
    multiplier: 2,
    retryForever: false,
  },
  idempotent: true, // Prevent duplicate events
  transactionalId: "post-service-producer",
});

// Dead Letter Queue for failed events
async function publishEvent(topic, message) {
  try {
    await producer.send({
      topic,
      messages: [message],
    });
  } catch (err) {
    logger.error("Kafka publish failed", { topic, err });

    // Write to DLQ for manual replay
    await db.collection("event_dlq").insertOne({
      topic,
      message,
      error: err.message,
      timestamp: new Date(),
    });
  }
}
```

### 8.4 Graceful Degradation

**Feed Service Degraded Mode:**

```typescript
async function getHotFeed(req, reply) {
  try {
    // Try Redis first
    const cached = await redis.zrevrange("feed:global:hot", 0, 24);
    if (cached.length > 0) {
      return await hydratePosts(cached);
    }
  } catch (redisErr) {
    logger.warn("Redis unavailable, degraded mode");
  }

  // Degraded: Query DB directly (slower)
  const posts = await db
    .collection("posts")
    .aggregate([
      { $match: { is_deleted: false } },
      {
        $lookup: {
          from: "vote_counts",
          localField: "post_id",
          foreignField: "target_id",
          as: "votes",
        },
      },
      { $sort: { "votes.score": -1 } },
      { $limit: 25 },
    ])
    .toArray();

  reply.header("X-Degraded-Mode", "true");
  return reply.send({ posts });
}
```

---

## 9. OBSERVABILITY (PRODUCTION-GRADE)

### 9.1 Logging Strategy

**Structured Logging (JSON):**

```typescript
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  formatters: {
    level: (label) => ({ level: label }),
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      headers: req.headers,
      remoteAddress: req.ip,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

// Request logging
app.addHook("onRequest", (req, reply, done) => {
  req.log = logger.child({ requestId: req.id });
  req.log.info({ req }, "Incoming request");
  done();
});

app.addHook("onResponse", (req, reply, done) => {
  req.log.info(
    {
      res: reply,
      responseTime: reply.getResponseTime(),
    },
    "Request completed"
  );
  done();
});
```

**Kafka Event Logging:**

```typescript
// Add trace ID to events
await producer.send({
  topic: "post.created",
  messages: [
    {
      key: postId,
      value: JSON.stringify({
        ...eventData,
        trace_id: req.id, // Propagate request ID
        timestamp: new Date().toISOString(),
      }),
    },
  ],
});

// Consumer logging
consumer.on("message", (message) => {
  const event = JSON.parse(message.value);
  logger.info(
    {
      topic: message.topic,
      partition: message.partition,
      offset: message.offset,
      trace_id: event.trace_id,
    },
    "Processing event"
  );
});
```

### 9.2 Metrics (Prometheus)

**Code Example:**

```typescript
import promClient from "prom-client";

const register = new promClient.Register();

// Counters
const httpRequestsTotal = new promClient.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

const kafkaMessagesProduced = new promClient.Counter({
  name: "kafka_messages_produced_total",
  help: "Total Kafka messages produced",
  labelNames: ["topic"],
  registers: [register],
});

// Histograms
const httpRequestDuration = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});

const cacheHitRate = new promClient.Gauge({
  name: "cache_hit_rate",
  help: "Cache hit rate",
  labelNames: ["cache_type"],
  registers: [register],
});

// Middleware
app.addHook("onResponse", (req, reply, done) => {
  httpRequestsTotal.inc({
    method: req.method,
    route: req.routerPath,
    status_code: reply.statusCode,
  });

  httpRequestDuration.observe(
    {
      method: req.method,
      route: req.routerPath,
      status_code: reply.statusCode,
    },
    reply.getResponseTime() / 1000
  );

  done();
});

// Expose metrics
app.get("/metrics", async (req, reply) => {
  reply.type("text/plain");
  return register.metrics();
});
```

**Grafana Dashboard Panels:**

1. Request rate (req/s) per service
2. p50/p95/p99 latency per endpoint
3. Error rate (5xx responses)
4. Kafka consumer lag per topic
5. Cache hit ratio
6. Database connection pool utilization
7. Redis memory usage

### 9.3 Distributed Tracing (Jaeger)

```typescript
import { initTracer } from "jaeger-client";

const tracer = initTracer({
  serviceName: "feed-service",
  sampler: {
    type: "probabilistic",
    param: 0.1, // Sample 10% of traces
  },
  reporter: {
    agentHost: "jaeger-agent",
    agentPort: 6831,
  },
});

// Trace HTTP requests
app.addHook("onRequest", (req, reply, done) => {
  const span = tracer.startSpan("http_request", {
    tags: {
      "http.method": req.method,
      "http.url": req.url,
    },
  });
  req.span = span;
  done();
});

app.addHook("onResponse", (req, reply, done) => {
  req.span.setTag("http.status_code", reply.statusCode);
  req.span.finish();
  done();
});

// Trace Kafka events
async function publishEvent(topic, message) {
  const span = tracer.startSpan("kafka_publish", {
    tags: { topic },
  });

  try {
    await producer.send({ topic, messages: [message] });
    span.setTag("success", true);
  } catch (err) {
    span.setTag("error", true);
    span.log({ event: "error", message: err.message });
    throw err;
  } finally {
    span.finish();
  }
}
```

### 9.4 Alerting Rules (Prometheus Alertmanager)

```yaml
groups:
  - name: feed_service_alerts
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status_code=~"5.."}[5m]) > 0.05
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High 5xx error rate detected"
          description: "Error rate is {{ $value }} req/s"

      - alert: HighLatency
        expr: histogram_quantile(0.95, http_request_duration_seconds_bucket) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High p95 latency detected"
          description: "p95 latency is {{ $value }}s"

      - alert: KafkaConsumerLag
        expr: kafka_consumer_lag > 10000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Kafka consumer lag is high"
          description: "Lag is {{ $value }} messages"

      - alert: CacheLowHitRate
        expr: cache_hit_rate < 0.7
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Cache hit rate is low"
          description: "Hit rate is {{ $value }}"
```

---

## 10. LOAD TESTING & BENCHMARKING

### 10.1 k6 Test Scripts

**Feed Load Test:**

```javascript
// feed-load-test.js
import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

const errorRate = new Rate("errors");

export const options = {
  stages: [
    { duration: "2m", target: 100 }, // Ramp up to 100 users
    { duration: "5m", target: 100 }, // Stay at 100 users
    { duration: "2m", target: 500 }, // Ramp up to 500 users
    { duration: "5m", target: 500 }, // Stay at 500 users
    { duration: "2m", target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<300", "p(99)<500"],
    errors: ["rate<0.01"],
  },
};

export default function () {
  const res = http.get("http://localhost:3000/api/feed/hot");

  check(res, {
    "status is 200": (r) => r.status === 200,
    "response time < 300ms": (r) => r.timings.duration < 300,
    "has posts": (r) => JSON.parse(r.body).posts.length > 0,
  }) || errorRate.add(1);

  sleep(1);
}
```

**Vote Storm Test:**

```javascript
// vote-storm-test.js
import http from "k6/http";
import { check } from "k6";

export const options = {
  scenarios: {
    vote_burst: {
      executor: "constant-arrival-rate",
      rate: 1000, // 1000 req/s
      timeUnit: "1s",
      duration: "1m",
      preAllocatedVUs: 50,
      maxVUs: 200,
    },
  },
};

const postIds = JSON.parse(open("./post_ids.json")); // Pre-generated post IDs

export default function () {
  const postId = postIds[Math.floor(Math.random() * postIds.length)];
  const voteType = Math.random() > 0.5 ? 1 : -1;

  const payload = JSON.stringify({
    target_id: postId,
    target_type: "post",
    vote_type: voteType,
  });

  const res = http.post("http://localhost:3000/api/votes", payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${__ENV.AUTH_TOKEN}`,
    },
  });

  check(res, {
    "status is 200": (r) => r.status === 200,
  });
}
```

### 10.2 Expected Results

**Baseline (No Load):**

- Feed API (cache hit): p95 < 50ms, p99 < 100ms
- Feed API (cache miss): p95 < 200ms, p99 < 400ms
- Vote API: p95 < 100ms, p99 < 200ms

**Under Load (500 concurrent users):**

- Feed API: p95 < 300ms, p99 < 500ms
- Vote API: p95 < 300ms, p99 < 600ms
- Error rate: < 0.1%
- Kafka consumer lag: < 5 seconds

**Bottleneck Analysis:**

- If Feed API slow → Check Redis hit rate, MongoDB connection pool
- If Vote API slow → Check PostgreSQL write throughput, connection pool
- If consumer lag high → Scale consumers, check Kafka partition count

---

## 11. DEPLOYMENT ARCHITECTURE

### 11.1 Docker Compose (Development)

```yaml
# docker-compose.yml
version: "3.8"

services:
  # === Services ===
  user-service:
    build: ./services/user-service
    ports:
      - "3001:3000"
    environment:
      DATABASE_URL: postgresql://user:pass@postgres:5432/social_feed
      REDIS_URL: redis://redis:6379
      KAFKA_BROKERS: kafka:9092
    depends_on:
      - postgres
      - redis
      - kafka

  post-service:
    build: ./services/post-service
    ports:
      - "3002:3000"
    environment:
      MONGO_URL: mongodb://mongo:27017/social_feed
      REDIS_URL: redis://redis:6379
      KAFKA_BROKERS: kafka:9092
    depends_on:
      - mongo
      - redis
      - kafka

  vote-service:
    build: ./services/vote-service
    ports:
      - "3003:3000"
    environment:
      DATABASE_URL: postgresql://user:pass@postgres:5432/social_feed
      REDIS_URL: redis://redis:6379
      KAFKA_BROKERS: kafka:9092
    depends_on:
      - postgres
      - redis
      - kafka

  feed-service:
    build: ./services/feed-service
    ports:
      - "3004:3000"
    environment:
      REDIS_URL: redis://redis:6379
      MONGO_URL: mongodb://mongo:27017/social_feed
      DATABASE_URL: postgresql://user:pass@postgres:5432/social_feed
    depends_on:
      - redis
      - mongo
      - postgres

  # === Consumers ===
  ranking-consumer:
    build: ./consumers/ranking-consumer
    environment:
      REDIS_URL: redis://redis:6379
      KAFKA_BROKERS: kafka:9092
      KAFKA_GROUP_ID: ranking-updater
    depends_on:
      - kafka
      - redis
    deploy:
      replicas: 2

  cache-invalidator:
    build: ./consumers/cache-invalidator
    environment:
      REDIS_URL: redis://redis:6379
      KAFKA_BROKERS: kafka:9092
      KAFKA_GROUP_ID: cache-invalidator
    depends_on:
      - kafka
      - redis

  # === Databases ===
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: social_feed
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./init-scripts/postgres:/docker-entrypoint-initdb.d

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --maxmemory 2gb --maxmemory-policy allkeys-lru

  # === Kafka ===
  zookeeper:
    image: confluentinc/cp-zookeeper:7.5.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000

  kafka:
    image: confluentinc/cp-kafka:7.5.0
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"
    depends_on:
      - zookeeper

  # === Monitoring ===
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    volumes:
      - grafana-data:/var/lib/grafana
      - ./monitoring/dashboards:/etc/grafana/provisioning/dashboards

  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "16686:16686" # UI
      - "6831:6831/udp" # Agent

volumes:
  postgres-data:
  mongo-data:
  prometheus-data:
  grafana-data:
```

### 11.2 Kubernetes (Production)

**Deployment Example (Feed Service):**

```yaml
# k8s/feed-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: feed-service
  labels:
    app: feed-service
spec:
  replicas: 5
  selector:
    matchLabels:
      app: feed-service
  template:
    metadata:
      labels:
        app: feed-service
    spec:
      containers:
        - name: feed-service
          image: myregistry/feed-service:v1.0.0
          ports:
            - containerPort: 3000
          env:
            - name: REDIS_URL
              valueFrom:
                secretKeyRef:
                  name: redis-secret
                  key: url
            - name: MONGO_URL
              valueFrom:
                secretKeyRef:
                  name: mongo-secret
                  key: url
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: feed-service
spec:
  selector:
    app: feed-service
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: feed-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: feed-service
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

**Kafka Consumer Deployment:**

```yaml
# k8s/ranking-consumer-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ranking-consumer
spec:
  replicas: 10 # Match Kafka partition count
  selector:
    matchLabels:
      app: ranking-consumer
  template:
    metadata:
      labels:
        app: ranking-consumer
    spec:
      containers:
        - name: ranking-consumer
          image: myregistry/ranking-consumer:v1.0.0
          env:
            - name: KAFKA_BROKERS
              value: "kafka-0.kafka-headless:9092,kafka-1.kafka-headless:9092"
            - name: KAFKA_GROUP_ID
              value: "ranking-updater"
            - name: REDIS_URL
              valueFrom:
                secretKeyRef:
                  name: redis-secret
                  key: url
          resources:
            requests:
              memory: "128Mi"
              cpu: "100m"
            limits:
              memory: "256Mi"
              cpu: "200m"
```

---

## 12. SECURITY

### 12.1 Authentication & Authorization

**JWT-based Auth:**

```typescript
// auth.middleware.ts
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function authenticateJWT(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return reply.code(401).send({ error: "Unauthorized" });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.user = { userId: decoded.userId };
  } catch (err) {
    return reply.code(401).send({ error: "Invalid token" });
  }
}

// Usage
app.register(async (instance) => {
  instance.addHook("onRequest", authenticateJWT);

  instance.post("/api/posts", createPost);
  instance.post("/api/votes", createVote);
});
```

### 12.2 Rate Limiting

```typescript
// rate-limiter.ts
import { RateLimiterRedis } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "rate_limit",
  points: 100, // 100 requests
  duration: 60, // per 60 seconds
});

export async function rateLimitMiddleware(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const userId = req.user?.userId || req.ip;

  try {
    await rateLimiter.consume(userId);
  } catch (err) {
    return reply.code(429).send({
      error: "Too many requests",
      retryAfter: err.msBeforeNext / 1000,
    });
  }
}

// Apply to specific routes
app.register(async (instance) => {
  instance.addHook("onRequest", rateLimitMiddleware);
  instance.post("/api/posts", createPost);
});
```

### 12.3 Input Validation

```typescript
// validation.schema.ts
import { Type } from "@sinclair/typebox";

export const createPostSchema = {
  body: Type.Object({
    title: Type.String({ minLength: 1, maxLength: 300 }),
    content: Type.String({ minLength: 1, maxLength: 40000 }),
    media_urls: Type.Optional(Type.Array(Type.String({ format: "uri" }))),
  }),
};

export const createVoteSchema = {
  body: Type.Object({
    target_id: Type.String({ format: "uuid" }),
    target_type: Type.Union([Type.Literal("post"), Type.Literal("comment")]),
    vote_type: Type.Union([Type.Literal(1), Type.Literal(-1)]),
  }),
};

// Usage
app.post(
  "/api/posts",
  {
    schema: createPostSchema,
    preValidation: [authenticateJWT, rateLimitMiddleware],
  },
  createPost
);
```

### 12.4 SQL Injection Prevention

```typescript
// Always use parameterized queries
const votes = await db.query(
  "SELECT * FROM votes WHERE user_id = ? AND target_id = ?",
  [userId, targetId]
);

// ORM (Knex.js example)
const votes = await db("votes")
  .where({ user_id: userId, target_id: targetId })
  .select("*");
```

### 12.5 XSS Prevention

```typescript
// Sanitize user input
import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

function sanitizeContent(content: string): string {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br"],
    ALLOWED_ATTR: ["href"],
  });
}

// Apply before saving to DB
const post = {
  title: sanitizeContent(req.body.title),
  content: sanitizeContent(req.body.content),
};
```

---

## 13. TESTING STRATEGY

### 13.1 Unit Tests

```typescript
// vote.service.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { VoteService } from "./vote.service";

describe("VoteService", () => {
  let voteService: VoteService;
  let mockDb: any;
  let mockKafka: any;

  beforeEach(() => {
    mockDb = {
      query: vi.fn(),
      transaction: vi.fn(),
    };
    mockKafka = {
      send: vi.fn(),
    };
    voteService = new VoteService(mockDb, mockKafka);
  });

  it("should create a new upvote", async () => {
    mockDb.transaction.mockImplementation(async (fn) => {
      const trx = {
        query: vi.fn().mockResolvedValue([]), // No existing vote
        insert: vi.fn().mockResolvedValue({ vote_id: "new-vote-id" }),
      };
      return fn(trx);
    });

    const result = await voteService.createVote({
      user_id: "user-1",
      target_id: "post-1",
      target_type: "post",
      vote_type: 1,
    });

    expect(result.success).toBe(true);
    expect(mockKafka.send).toHaveBeenCalledWith(
      expect.objectContaining({
        topic: "vote.updated",
      })
    );
  });

  it("should update existing vote", async () => {
    mockDb.transaction.mockImplementation(async (fn) => {
      const trx = {
        query: vi
          .fn()
          .mockResolvedValue([{ vote_id: "existing-vote", vote_type: -1 }]),
        update: vi.fn().mockResolvedValue({ vote_id: "existing-vote" }),
      };
      return fn(trx);
    });

    const result = await voteService.createVote({
      user_id: "user-1",
      target_id: "post-1",
      target_type: "post",
      vote_type: 1,
    });

    expect(result.success).toBe(true);
    expect(mockDb.transaction).toHaveBeenCalled();
  });
});
```

### 13.2 Integration Tests

```typescript
// feed.integration.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { FastifyInstance } from "fastify";
import { buildApp } from "./app";

describe("Feed Integration Tests", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp({
      redis: { host: "localhost", port: 6379 },
      mongo: { url: "mongodb://localhost:27017/test" },
    });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return hot feed", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/feed/hot",
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.posts).toBeInstanceOf(Array);
    expect(body.posts.length).toBeGreaterThan(0);
  });

  it("should return cached feed on second request", async () => {
    const start1 = Date.now();
    await app.inject({ method: "GET", url: "/api/feed/hot" });
    const duration1 = Date.now() - start1;

    const start2 = Date.now();
    await app.inject({ method: "GET", url: "/api/feed/hot" });
    const duration2 = Date.now() - start2;

    expect(duration2).toBeLessThan(duration1);
  });
});
```

### 13.3 End-to-End Tests

```typescript
// e2e/user-flow.test.ts
import { test, expect } from "@playwright/test";

test.describe("User Flow", () => {
  test("user can create post and vote", async ({ page }) => {
    // 1. Login
    await page.goto("http://localhost:5173/login");
    await page.fill('input[name="username"]', "testuser");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("http://localhost:5173/");

    // 2. Create post
    await page.click('button:has-text("Create Post")');
    await page.fill('input[name="title"]', "Test Post Title");
    await page.fill('textarea[name="content"]', "This is a test post content.");
    await page.click('button:has-text("Submit")');
    await expect(page.locator("text=Test Post Title")).toBeVisible();

    // 3. Vote on post
    await page.click('button[aria-label="upvote"]');
    await expect(page.locator("text=1 points")).toBeVisible();
  });
});
```

---

## 14. SCALING STRATEGY

### 14.1 Horizontal Scaling

**Service Scaling:**

- **Feed Service**: Scale to 10+ instances (read-heavy)
- **Vote Service**: Scale to 5+ instances (write-heavy)
- **Post Service**: Scale to 5+ instances
- **Consumers**: Match Kafka partition count (e.g., 10 partitions = 10 consumers)

**Database Scaling:**

- **PostgreSQL**: Primary + 2 read replicas
- **MongoDB**: 3-node replica set
- **Redis**: Redis Cluster (6 nodes: 3 primary + 3 replica)

### 14.2 Vertical Scaling

**Resource Allocation:**
| Component | CPU | RAM |
|-----------|-----|-----|
| Feed Service | 2 cores | 4GB |
| Vote Service | 2 cores | 2GB |
| PostgreSQL | 4 cores | 16GB |
| MongoDB | 4 cores | 16GB |
| Redis | 2 cores | 8GB |
| Kafka Broker | 4 cores | 8GB |

### 14.3 Database Sharding (Future)

**PostgreSQL Sharding (by user_id):**

```
Shard 1: user_id % 4 == 0
Shard 2: user_id % 4 == 1
Shard 3: user_id % 4 == 2
Shard 4: user_id % 4 == 3
```

**MongoDB Sharding (by post_id):**

```javascript
sh.shardCollection("social_feed.posts", { post_id: "hashed" });
```

---

## 15. COST ESTIMATION (AWS)

### 15.1 Monthly Cost Breakdown

| Resource           | Specs           | Quantity | Unit Cost | Total             |
| ------------------ | --------------- | -------- | --------- | ----------------- |
| EC2 (Feed Service) | t3.medium       | 10       | $30       | $300              |
| EC2 (Vote Service) | t3.medium       | 5        | $30       | $150              |
| RDS PostgreSQL     | db.r6g.xlarge   | 1        | $290      | $290              |
| DocumentDB (Mongo) | db.r6g.xlarge   | 3        | $290      | $870              |
| ElastiCache Redis  | cache.r6g.large | 3        | $140      | $420              |
| MSK (Kafka)        | kafka.m5.large  | 3        | $150      | $450              |
| ALB                | -               | 1        | $23       | $23               |
| Data Transfer      | -               | 5TB      | $0.09/GB  | $450              |
| **Total**          |                 |          |           | **~$2,953/month** |

### 15.2 Cost Optimization

- Use spot instances for consumers (save 70%)
- Reserved instances for stable services (save 40%)
- S3 for media storage (cheaper than EC2)
- CloudFront CDN for static assets

---

## 16. MIGRATION PLAN (Optional Phase 2)

### 16.1 Monolith to Microservices

**Step 1: Extract Read Path (Week 1-2)**

- Create Feed Service
- Migrate feed logic from monolith
- Dual-write to both systems

**Step 2: Extract Write Path (Week 3-4)**

- Create Post/Vote Services
- Implement Kafka event publishing
- Gradually switch traffic

**Step 3: Data Migration (Week 5-6)**

- Export data from monolith DB
- Import to new databases
- Verify consistency

**Step 4: Cutover (Week 7)**

- 100% traffic to new services
- Monitor for 1 week
- Decommission monolith

---

## 17. RUNBOOK (OPERATIONS)

### 17.1 Common Issues

**Issue: Redis down**

```bash
# Check status
kubectl get pods -l app=redis

# Restart
kubectl rollout restart deployment/redis

# Verify recovery
curl http://feed-service/health
```

**Issue: Kafka consumer lag**

```bash
# Check lag
kafka-consumer-groups --bootstrap-server kafka:9092 --group ranking-updater --describe

# Scale consumers
kubectl scale deployment ranking-consumer --replicas=20

# Reset offsets (emergency)
kafka-consumer-groups --bootstrap-server kafka:9092 --group ranking-updater --reset-offsets --to-earliest --execute --topic post.created
```

**Issue: Database connection pool exhausted**

```bash
# Check active connections
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';

# Kill long-running queries
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'active' AND query_start < NOW() - INTERVAL '5 minutes';

# Increase pool size (config)
DATABASE_POOL_SIZE=50
```

### 17.2 Deployment Checklist

- [ ] Run database migrations
- [ ] Update environment variables
- [ ] Deploy services (blue-green)
- [ ] Verify health endpoints
- [ ] Check metrics dashboard
- [ ] Monitor error rates for 15 minutes
- [ ] Rollback if error rate > 1%

---

## 18. FUTURE ENHANCEMENTS

1. **Real-time Notifications**: WebSocket for live updates
2. **Content Recommendation**: ML-based feed personalization
3. **Image Processing**: Thumbnail generation, CDN integration
4. **Advanced Search**: Elasticsearch full-text search
5. **Moderation**: Auto-flag spam/toxic content
6. **Analytics Dashboard**: User behavior tracking
7. **Multi-region**: Deploy in US, EU, Asia
8. **Mobile Apps**: iOS/Android native apps

---

## 19. CONCLUSION

Hệ thống được thiết kế với các nguyên tắc:

1. **Performance First**: Cache-first, async side-effects
2. **Low Coupling**: Events over direct calls
3. **Graceful Degradation**: System remains functional during partial failures
4. **Observability**: Comprehensive logging, metrics, tracing
5. **Scalability**: Horizontal scaling at every layer

**Technology Choices Rationale:**

- **Kafka**: Reliable event streaming, decouples services
- **Redis**: Ultra-fast cache, feed rankings
- **PostgreSQL**: ACID compliance for critical data (votes)
- **MongoDB**: Flexible schema for content
- **Node.js**: High I/O throughput, ecosystem

**Key Metrics to Track:**

- Feed API p95 latency
- Kafka consumer lag
- Cache hit ratio
- Database connection pool utilization
- Error rate per service

Hệ thống này có thể scale đến **100M users** với đúng resource allocation và continuous optimization.
