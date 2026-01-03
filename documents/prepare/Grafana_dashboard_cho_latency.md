Dưới đây là **thiết kế Grafana Dashboard CHUẨN PRODUCTION để theo dõi latency**, đúng bối cảnh **REST + gRPC + Redis + DB** của dự án bạn.
Mục tiêu là: **nhìn dashboard → biết ngay bottleneck ở đâu**. Đây là thứ **rất ít junior làm được**, nhưng tech lead nhìn là đánh giá cao ngay.

---

# 1. Tổng quan Dashboard

**Tên dashboard (gợi ý):**
`Social Feed System – Latency & Performance`

### Mục tiêu dashboard trả lời 5 câu hỏi:

1. Latency tổng thể của hệ thống là bao nhiêu?
2. REST hay gRPC đang chậm?
3. Cache có thực sự hiệu quả không?
4. DB nào là bottleneck?
5. Khi load tăng, hệ thống phản ứng thế nào?

---

# 2. Kiến trúc metrics (bạn cần expose)

## 2.1 Metrics từ Node.js services

Dùng:

- `prom-client`

Expose endpoint:

```
GET /metrics
```

### Các metric bắt buộc:

- HTTP latency (REST)
- gRPC latency
- Redis hit/miss
- DB query duration
- Request rate
- Error rate

---

## 2.2 Naming convention (rất quan trọng)

| Loại     | Metric                          |
| -------- | ------------------------------- |
| REST     | `http_request_duration_seconds` |
| gRPC     | `grpc_request_duration_seconds` |
| Redis    | `redis_cache_hits_total`        |
| Redis    | `redis_cache_misses_total`      |
| Postgres | `pg_query_duration_seconds`     |
| Mongo    | `mongo_query_duration_seconds`  |

---

# 3. Layout Dashboard (chuẩn)

## Row 1 – System Overview

### Panel 1 – Request Rate (RPS)

**Type:** Time series

**PromQL:**

```promql
sum(rate(http_requests_total[1m]))
```

**Ý nghĩa:**

- Biết hệ thống đang chịu tải bao nhiêu

---

### Panel 2 – Error Rate

```promql
sum(rate(http_requests_errors_total[1m]))
```

**Tech lead nhìn vào đây đầu tiên.**

---

## Row 2 – REST API Latency

### Panel 3 – REST Latency (p50 / p95 / p99)

```promql
histogram_quantile(
  0.95,
  sum(rate(http_request_duration_seconds_bucket[1m])) by (le)
)
```

Làm thêm p50 và p99 bằng cách đổi `0.50`, `0.99`.

**Ý nghĩa:**

- Đo trải nghiệm người dùng
- Đặt SLO cho frontend

---

## Row 3 – gRPC Latency (ĐIỂM ĂN TIỀN)

### Panel 4 – gRPC Latency p95

```promql
histogram_quantile(
  0.95,
  sum(rate(grpc_request_duration_seconds_bucket[1m])) by (le)
)
```

### Panel 5 – gRPC Latency p99

```promql
histogram_quantile(
  0.99,
  sum(rate(grpc_request_duration_seconds_bucket[1m])) by (le)
)
```

**Cách kể khi phỏng vấn:**

> “We monitor gRPC p95 and p99 separately to ensure internal service calls don’t become a hidden bottleneck.”

---

## Row 4 – Cache Effectiveness (Redis)

### Panel 6 – Cache Hit Ratio

```promql
sum(rate(redis_cache_hits_total[1m]))
/
(
  sum(rate(redis_cache_hits_total[1m])) +
  sum(rate(redis_cache_misses_total[1m]))
)
```

**Giá trị mong muốn:** > 0.7

---

### Panel 7 – Feed Latency: Cache Hit vs Miss (RẤT MẠNH)

Bạn cần expose 2 label:

- `source="cache"`
- `source="db"`

```promql
histogram_quantile(
  0.95,
  sum(rate(feed_request_duration_seconds_bucket[1m])) by (le, source)
)
```

👉 **Panel này cho thấy Redis cứu hệ thống thế nào.**

---

## Row 5 – Database Latency

### Panel 8 – PostgreSQL Query Latency p95

```promql
histogram_quantile(
  0.95,
  sum(rate(pg_query_duration_seconds_bucket[1m])) by (le)
)
```

---

### Panel 9 – MongoDB Query Latency p95

```promql
histogram_quantile(
  0.95,
  sum(rate(mongo_query_duration_seconds_bucket[1m])) by (le)
)
```

**Khi phỏng vấn bạn nói:**

> “We compare Postgres and MongoDB latency under load to validate data placement decisions.”

---

## Row 6 – Saturation (Optional nhưng rất tốt)

### Panel 10 – CPU Usage

```promql
process_cpu_seconds_total
```

### Panel 11 – Memory Usage

```promql
process_resident_memory_bytes
```

---

# 4. Dashboard Annotations (bonus)

### Annotation cho:

- Start load test
- Redis down
- Scale service

Ví dụ:

```
Load test started – 20k VUs
```

👉 Khi xem lại, bạn thấy **latency spike vì lý do gì**.

---

# 5. Khi phỏng vấn – bạn nói thế nào? (RẤT QUAN TRỌNG)

Bạn có thể nói:

> “I built a Grafana dashboard focusing on latency percentiles instead of averages.
> It allows me to quickly identify whether latency issues come from REST APIs, gRPC internal calls, cache misses, or database queries.”

👉 **Câu này cực kỳ system-oriented.**

---

# 6. Những lỗi cần tránh

❌ Chỉ hiển thị average latency
❌ Không phân biệt REST vs gRPC
❌ Không có cache hit ratio
❌ Không đo p95 / p99

---
