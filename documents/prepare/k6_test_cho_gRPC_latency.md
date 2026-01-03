Tôi sẽ trình bày theo 4 phần:

1. Mục tiêu test
2. Kiến trúc test gRPC với k6
3. Script k6 hoàn chỉnh
4. Cách đọc kết quả & nói khi phỏng vấn

---

## 1. Mục tiêu của bài test gRPC latency

### Bạn đang chứng minh điều gì?

- Latency của **service-to-service communication**
- Hiệu quả của:

  - Batch request
  - Protobuf
  - HTTP/2

### Câu hỏi bạn trả lời được:

- gRPC nhanh hơn REST bao nhiêu?
- p95 / p99 latency là bao nhiêu?
- Bottleneck nằm ở đâu?

---

## 2. Nguyên tắc test gRPC bằng k6

k6 **support gRPC native**, không cần hack.

### Điều kiện:

- gRPC server **không bật TLS** (local)
- Có `.proto` file thật
- Method test là **read-heavy**

---

## 3. k6 gRPC Latency Test Script

### 3.1. Cấu trúc thư mục

```
k6/
├── grpc/
│   ├── content.proto
│   └── grpc_content_test.js
```

---

### 3.2. Ví dụ `content.proto` (rút gọn để test)

```proto
syntax = "proto3";

package content.v1;

service ContentService {
  rpc GetPostsBatch (GetPostsBatchRequest)
      returns (GetPostsBatchResponse);
}

message GetPostsBatchRequest {
  repeated string post_ids = 1;
}

message GetPostsBatchResponse {
  repeated Post posts = 1;
}

message Post {
  string id = 1;
  string title = 2;
  string content = 3;
}
```

---

### 3.3. Script k6 gRPC (`grpc_content_test.js`)

```javascript
import grpc from "k6/net/grpc";
import { check, sleep } from "k6";

const client = new grpc.Client();

client.load(["./"], "content.proto");

export const options = {
  scenarios: {
    grpc_latency_test: {
      executor: "constant-vus",
      vus: 50,
      duration: "30s",
    },
  },
  thresholds: {
    grpc_req_duration: ["p(95)<50", "p(99)<100"],
  },
};

export default () => {
  client.connect("localhost:50051", {
    plaintext: true,
  });

  const payload = {
    post_ids: ["post-1", "post-2", "post-3", "post-4", "post-5"],
  };

  const response = client.invoke(
    "content.v1.ContentService/GetPostsBatch",
    payload
  );

  check(response, {
    "status is OK": (r) => r && r.status === grpc.StatusOK,
  });

  client.close();
  sleep(1);
};
```

---

## 4. Cách đọc kết quả (cực kỳ quan trọng)

Sau khi chạy:

```bash
k6 run grpc_content_test.js
```

### Bạn sẽ thấy:

- `grpc_req_duration`

  - avg
  - p95
  - p99

Ví dụ:

```
grpc_req_duration..............: avg=12ms  p(95)=28ms  p(99)=45ms
```

👉 **Đây là con số rất đẹp cho internal service call**

---

## 5. So sánh với REST (BONUS rất mạnh)

Bạn nên làm thêm:

- REST endpoint `/internal/posts/batch`
- Test tương tự bằng `http.batch`

### Khi phỏng vấn bạn nói:

> “With gRPC batch calls, p95 latency dropped by ~40% compared to REST due to smaller payload and HTTP/2 multiplexing.”

---

## 6. Những lỗi phổ biến (tránh để không mất điểm)

❌ Gọi từng post một
❌ Test gRPC nhưng payload quá lớn
❌ Không batch
❌ Không có threshold p95 / p99

---

## 7. Cách ghi vào README (ăn điểm)

Bạn ghi đúng câu này:

> _“We benchmarked gRPC internal calls using k6.
> Batch gRPC requests achieved sub-50ms p95 latency under 50 concurrent virtual users.”_

---
