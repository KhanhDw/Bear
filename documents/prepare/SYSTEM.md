# 1. Tổng quan dự án

**Tên dự án:**
**High-Load Social Feed System (Reddit-like)**

**Mục tiêu kỹ thuật:**

- Xây dựng hệ thống **microservices** chịu tải cao
- Kết hợp **REST + gRPC** đúng vai trò
- Vận hành **2 database khác loại** trong cùng hệ thống
- Áp dụng **Redis cache** để tối ưu latency
- Thực hiện **load test, benchmark, observability**
- Mô phỏng **vận hành hệ thống lớn trong thực tế**

---

# 2. Nguyên tắc kiến trúc (rất quan trọng)

| Phạm vi                | Công nghệ  |
| ---------------------- | ---------- |
| Frontend ↔ Backend     | REST       |
| API Gateway            | REST       |
| Service ↔ Service      | gRPC       |
| High-throughput ingest | gRPC       |
| Cache / Ranking        | Redis      |
| Relational data        | PostgreSQL |
| Document / Event       | MongoDB    |

---

# 3. Kiến trúc tổng thể (chuẩn production)

```
                     ┌──────────────────┐
                     │   React + Vite   │
                     └─────────┬────────┘
                               │ REST
                     ┌─────────▼────────┐
                     │   API Gateway    │
                     │ (Fastify + TS)   │
                     └─────────┬────────┘
                               │ REST
    ┌───────────────┬──────────┼───────────┬───────────────┐
    │               │          │           │               │
    ▼               ▼          ▼           ▼               ▼
 Auth Service   User Service  Feed Service Content Service Analytics
 (Postgres)    (Postgres)   (Redis+PG)    (MongoDB)     (MongoDB)
                     ▲           │
                     │           │ gRPC
                     └───────────┴───────────────┐
                                                 ▼
                                           gRPC Services
```

---

# 4. Microservices chi tiết

## 4.1 API Gateway

- REST only
- Authentication
- Rate limit
- Request routing
- Không business logic

---

## 4.2 Auth Service (PostgreSQL)

- JWT
- Refresh token
- Index:

  - email
  - created_at

---

## 4.3 User Service (PostgreSQL)

- User profile
- Follow / relationship
- gRPC exposed:

  - `GetUserProfile`
  - `GetUsersBatch`

---

## 4.4 Content Service (MongoDB)

- Post
- Comment
- High write throughput
- gRPC exposed:

  - `GetPostsBatch`
  - `CreatePost`

- Index:

  - created_at
  - author_id

---

## 4.5 Feed Service (Core của hệ thống)

- Generate:

  - Home feed
  - Hot feed

- Redis:

  - Sorted set ranking
  - Cache feed

- PostgreSQL:

  - Vote
  - Metadata

- gRPC client:

  - User Service
  - Content Service

---

## 4.6 Analytics Service (MongoDB)

- Ingest event (gRPC)
- Không block main flow
- High throughput

---

# 5. Database Design & Test Strategy

## PostgreSQL

- Cursor-based pagination
- Composite index
- Explain Analyze
- Connection pool test

## MongoDB

- Bulk insert
- Aggregation pipeline
- Read vs write benchmark

## Redis

- TTL
- Cache invalidation
- Cache hit ratio

---

# 6. gRPC Design (mức vừa đủ – đúng chất)

### Protobuf

- Versioning
- DTO rõ ràng
- 1 proto/service

### Ví dụ:

- `user.proto`
- `content.proto`
- `analytics.proto`

👉 Không over-engineering.

---

# 7. REST API (Client-facing)

### Feed

```
GET /feed/home
GET /feed/hot
```

### Content

```
POST /posts
POST /comments
```

---

# 8. Frontend (React + Zustand)

### Chức năng

- Login
- Feed list
- Load more
- Vote

### Mục tiêu

- Demo flow
- Không tập trung UI

---

# 9. Load Testing & Benchmark (phần quyết định)

## Tool

- k6

## Test Scenarios

### Scenario 1 – Feed Read (cache ON/OFF)

- 10k – 30k concurrent
- REST → Feed → gRPC → Services

### Scenario 2 – Write Heavy

- Post + Comment

### Scenario 3 – gRPC vs REST (Bonus)

- Internal call latency
- Payload size

---

# 10. Observability

### Logging

- Pino
- Request ID

### Metrics

- Prometheus
- Grafana:

  - RPS
  - Latency
  - Cache hit
  - Error rate

---

# 11. Failure Simulation

- Redis down → fallback DB
- Mongo slow → feed từ cache
- Scale feed service

---

# 12. Docker & Deployment

- Dockerfile từng service
- docker-compose:

  - services
  - DBs
  - Redis
  - Prometheus
  - Grafana

---

# 13. Roadmap triển khai (thực tế)

### Tuần 1

- Auth + User Service
- REST baseline

### Tuần 2

- Content Service (MongoDB)

### Tuần 3

- Feed Service + Redis

### Tuần 4

- gRPC integration

### Tuần 5

- Load test
- Tối ưu

---

# 14. Deliverables xin việc

- GitHub repo
- README chuyên nghiệp
- Diagram kiến trúc
- Benchmark report
- k6 scripts

---

# 15. Giá trị khi đi phỏng vấn

Bạn chứng minh được:

- Hiểu system design
- Hiểu REST vs gRPC
- Cache strategy
- Performance trade-off
- Microservices thực tế

---

## KẾT LUẬN (rất thẳng)

Với plan này, dự án của bạn vượt xa đồ án thông thường và tiệm cận production mindset.

# Bước tiếp theo tôi đề xuất (chọn 1):

Thiết kế proto file chi tiết

Vẽ architecture diagram chi tiết

Viết README hoàn chỉnh

Thiết kế k6 test scripts

Bạn chọn tiếp bước nào, tôi làm ngay và sâu.

# ----------------------------------------------------
