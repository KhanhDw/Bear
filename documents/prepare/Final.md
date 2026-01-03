## 1. Chuẩn hóa Business Scenario (rất quan trọng)

### Bài toán nghiệp vụ (viết đúng để ghi điểm)

> Một nền tảng social feed tương tự Reddit, nơi người dùng tạo nội dung, tương tác bằng vote, và hệ thống phải tạo feed nhanh cho lượng người dùng lớn với read-heavy workload.

### Đặc điểm nghiệp vụ cốt lõi

- **Read-heavy** (90% đọc feed)
- **Hot ranking thay đổi liên tục**
- **Latency nhạy cảm** (UX)
- **High concurrency**
- **Data growth nhanh**

👉 Đây là lý do tồn tại của:

- Redis
- gRPC
- Cache-heavy feed
- Load testing

---

## 2. Chuẩn hóa Domain Model (để tránh làm “CRUD project”)

### User

- Authentication
- Profile
- Follow (optional)

### Post / Comment (MongoDB)

- Nội dung thay đổi linh hoạt
- Số lượng lớn
- Write-heavy

### Vote / Ranking (Redis + PostgreSQL)

- Vote: cần consistency → PostgreSQL
- Ranking: cần speed → Redis Sorted Set

### Feed Generation

- Kết hợp:

  - Cache
  - Ranking
  - Batch data fetching

---

## 3. Điều kiện hệ thống BẮT BUỘC (nâng cấp từ mô tả ban đầu)

### 3.1 Performance Requirements (SLO rõ ràng)

Bạn nên đặt **SLO cụ thể**, ví dụ:

| Thành phần             | SLO     |
| ---------------------- | ------- |
| Feed API (cache hit)   | < 100ms |
| Feed API (cache miss)  | < 300ms |
| gRPC internal call p95 | < 50ms  |
| Error rate             | < 0.1%  |

👉 Đây là thứ **tech lead rất thích**.

---

### 3.2 Data Volume & Growth

Không nói chung chung “vài triệu record”, mà nói:

- Users: 100k – 500k
- Posts: 1 – 5 triệu
- Comments: 10 – 20 triệu
- Votes: 50 – 100 triệu

👉 Từ đó justify:

- Index
- Partition
- Cache

---

### 3.3 Concurrency Model

- 10k – 30k concurrent users
- Peak traffic giả lập
- Burst traffic (sudden spike)

---

## 4. Chiến lược Data & Cache (nâng level rõ rệt)

### 4.1 Cache Strategy (bắt buộc có lý do)

| Data         | Cache?  | Lý do                 |
| ------------ | ------- | --------------------- |
| Feed         | YES     | Read-heavy            |
| Post detail  | YES     | Hot content           |
| User profile | YES     | Ít thay đổi           |
| Vote count   | Partial | Invalidate thông minh |

### Cache Invalidation

- TTL
- Event-based (vote, new post)

👉 **Nói được cache invalidation = + điểm lớn**

---

### 4.2 Data Consistency Trade-off

- Vote count:

  - Redis (eventual)
  - PostgreSQL (source of truth)

Bạn cần **chấp nhận eventual consistency** và giải thích được.

---

## 5. Observability – cải tiến từ “có” → “dùng được”

### Logging

- Structured log
- Request ID
- Correlation giữa services

### Metrics

- p95 / p99 latency
- Cache hit ratio
- gRPC vs REST latency

### Tracing (bonus)

- Theo dõi feed request end-to-end

---

## 6. Load Testing – từ “test” → “benchmark”

### Cải tiến bắt buộc:

- Test từng layer:

  - API Gateway
  - Feed Service
  - gRPC calls

- So sánh:

  - Cache ON vs OFF
  - gRPC vs REST
  - Index vs no index

### Output không chỉ là số:

- Biểu đồ
- Phân tích bottleneck
- Quyết định tối ưu

---

## 7. Deployment – thêm điều kiện vận hành thực tế

### Bắt buộc

- Docker cho từng service
- Docker Compose cho local

### Cải tiến

- Scale Feed Service
- Resource limit (CPU / RAM)

### Bonus

- Kubernetes (local)
- Horizontal scaling

---

## 8. Failure Handling – phần phân biệt junior vs system-oriented

### Các tình huống phải mô phỏng:

- Redis down
- MongoDB latency tăng
- gRPC timeout
- One service crash

### Hệ thống phải:

- Graceful degradation
- Fallback logic
- Timeout + retry (có kiểm soát)

---

## 9. Security & Stability (nhỏ nhưng rất có giá trị)

- Rate limiting
- Input validation
- Circuit breaker (basic)
- gRPC timeout config

---

## 10. Cải tiến Frontend (đúng mức)

Frontend **không phải trọng tâm**, nhưng:

- Zustand: thể hiện global state
- Pagination / infinite scroll
- Loading state rõ ràng

---

## 11. Chuẩn hóa lại danh sách công nghệ (phiên bản xin việc)

### Backend

- Node.js + Fastify + TypeScript
- REST + gRPC
- PostgreSQL + MongoDB
- Redis
- Prometheus + Grafana
- k6

### Frontend

- React + Vite
- Zustand

### Infra

- Docker
- Docker Compose

---

## 12. Kết luận – phiên bản “nâng cấp” của mô tả ban đầu

> Đây không còn là một project CRUD hay demo công nghệ, mà là **một hệ thống social feed có định hướng performance, scalability và vận hành**, được thiết kế để học và chứng minh năng lực backend/system engineering.
