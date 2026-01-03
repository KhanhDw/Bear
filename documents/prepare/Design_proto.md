Dưới đây là **thiết kế proto file CHI TIẾT – ĐÚNG CHUẨN PRODUCTION**, bám sát **plan cuối** của bạn, **không over-engineering**, nhưng đủ sâu để **ghi điểm system design khi phỏng vấn**.

Tôi sẽ trình bày theo thứ tự:

1. Nguyên tắc thiết kế proto
2. Cấu trúc thư mục
3. Từng proto file (User, Content, Feed, Analytics)
4. Giải thích vì sao thiết kế như vậy
5. Cách bạn “kể câu chuyện này” khi phỏng vấn

---

# 1. Nguyên tắc thiết kế gRPC cho dự án này

### Những nguyên tắc bạn PHẢI tuân thủ

- gRPC **chỉ dùng nội bộ**
- Method **granular vừa đủ**
- Ưu tiên **batch request**
- DTO rõ ràng, không reuse bừa bãi
- Có versioning từ đầu

👉 Mục tiêu: **low latency + giảm chatty calls**

---

# 2. Cấu trúc thư mục proto (chuẩn)

```
proto/
├── common/
│   └── pagination.proto
│
├── user/
│   └── user_v1.proto
│
├── content/
│   └── content_v1.proto
│
├── feed/
│   └── feed_v1.proto
│
└── analytics/
    └── analytics_v1.proto
```

---

# 3. Chi tiết từng proto file

---

## 3.1 Common – Pagination (tái sử dụng có kiểm soát)

### `common/pagination.proto`

```proto
syntax = "proto3";

package common.v1;

message CursorPagination {
  string cursor = 1;
  int32 limit = 2;
}
```

**Giải thích:**

- Cursor-based pagination → scalable
- Không dùng offset (anti-pattern cho large data)

---

## 3.2 User Service Proto

### `user/user_v1.proto`

```proto
syntax = "proto3";

package user.v1;

service UserService {
  rpc GetUserProfile(GetUserProfileRequest)
      returns (GetUserProfileResponse);

  rpc GetUsersBatch(GetUsersBatchRequest)
      returns (GetUsersBatchResponse);
}

message GetUserProfileRequest {
  string user_id = 1;
}

message GetUserProfileResponse {
  User user = 1;
}

message GetUsersBatchRequest {
  repeated string user_ids = 1;
}

message GetUsersBatchResponse {
  repeated User users = 1;
}

message User {
  string id = 1;
  string username = 2;
  string avatar_url = 3;
  int64 created_at = 4;
}
```

### Vì sao thiết kế như vậy?

- **Không có Create/Update** → user được tạo qua REST
- Batch call → Feed Service không gọi N lần
- DTO nhỏ → latency thấp

---

## 3.3 Content Service Proto (MongoDB core)

### `content/content_v1.proto`

```proto
syntax = "proto3";

package content.v1;

import "common/pagination.proto";

service ContentService {
  rpc GetPost(GetPostRequest)
      returns (GetPostResponse);

  rpc GetPostsBatch(GetPostsBatchRequest)
      returns (GetPostsBatchResponse);

  rpc CreatePost(CreatePostRequest)
      returns (CreatePostResponse);
}

message GetPostRequest {
  string post_id = 1;
}

message GetPostResponse {
  Post post = 1;
}

message GetPostsBatchRequest {
  repeated string post_ids = 1;
}

message GetPostsBatchResponse {
  repeated Post posts = 1;
}

message CreatePostRequest {
  string author_id = 1;
  string title = 2;
  string content = 3;
}

message CreatePostResponse {
  string post_id = 1;
}

message Post {
  string id = 1;
  string author_id = 2;
  string title = 3;
  string content = 4;
  int64 created_at = 5;
}
```

### Điểm ăn tiền

- MongoDB phù hợp document
- Batch read cho feed aggregation
- Write path đơn giản → throughput cao

---

## 3.4 Feed Service Proto (Optional – nội bộ)

Feed service **thường không expose gRPC**, nhưng nếu muốn clean architecture:

### `feed/feed_v1.proto`

```proto
syntax = "proto3";

package feed.v1;

import "common/pagination.proto";

service FeedInternalService {
  rpc GenerateFeed(GenerateFeedRequest)
      returns (GenerateFeedResponse);
}

message GenerateFeedRequest {
  string user_id = 1;
  common.v1.CursorPagination pagination = 2;
}

message GenerateFeedResponse {
  repeated FeedItem items = 1;
  string next_cursor = 2;
}

message FeedItem {
  string post_id = 1;
  int64 score = 2;
}
```

👉 **REST vẫn là interface chính cho feed**, proto này chỉ dùng nội bộ.

---

## 3.5 Analytics Service Proto (High-throughput)

### `analytics/analytics_v1.proto`

```proto
syntax = "proto3";

package analytics.v1;

service AnalyticsService {
  rpc IngestEvent(IngestEventRequest)
      returns (IngestEventResponse);
}

message IngestEventRequest {
  string event_type = 1;
  string user_id = 2;
  string entity_id = 3;
  int64 timestamp = 4;
}

message IngestEventResponse {
  bool success = 1;
}
```

### Vì sao dùng gRPC ở đây?

- Fire-and-forget
- Payload nhỏ
- Không block request chính

---

# 4. Vì sao thiết kế proto này “đúng chuẩn hệ thống lớn”

| Nguyên tắc       | Áp dụng      |
| ---------------- | ------------ |
| Boundary rõ      | REST vs gRPC |
| Batch-first      | Giảm network |
| DTO nhỏ          | Latency thấp |
| Versioned        | Dễ mở rộng   |
| Không overdesign | Dễ explain   |

---

# 5. Khi phỏng vấn – bạn nói thế nào?

Bạn có thể nói **nguyên văn**:

> “I use gRPC only for internal service-to-service communication. REST is used for client-facing APIs.
> The proto contracts are versioned, batch-oriented, and optimized for low-latency feed aggregation.”

👉 **Câu này ăn điểm rất mạnh.**

# ----------------------------------------------------
