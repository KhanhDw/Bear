# mỗi service có luồng xử lý như sau:

# Luồng 1: Luồng khởi động ứng dụng (startup flow)

```bash
server.ts → app.ts → plugins → config
```

Trong quá trình này:

```bash
config/\* đọc env, kết nối Mongo, Redis, Kafka
plugins/\* gắn auth, redis client, metrics vào Fastify context
routes của các module (post, health) được đăng ký
```

=> Luồng này quyết định service có “sống” hay chết ngay từ đầu.

# Luồng 2: Luồng xử lý HTTP request (request → response)

```bash
post.routes.ts → post.controller.ts → post.service.ts → (post.repository.ts | post.cache.ts | post.events.ts) → response
```

```bash
routes: chỉ khai báo endpoint + method
controller: nhận request, map dữ liệu, gọi service
service: business logic thật sự
repository: truy cập MongoDB
cache: đọc/ghi Redis
events: bắn Kafka event (async side-effect)
```

=> Luồng này tuân thủ đúng tư tưởng Controller mỏng – Service dày.

# Luồng 3: Luồng dữ liệu & side-effect (data & async flow)

=>Luồng này không trả response trực tiếp, mà chạy song song hoặc sau business logic.

```bash
Từ post.service.ts có thể:
gọi post.cache.ts để cache
gọi post.events.ts để publish Kafka
dùng shared/* (pagination, circuit breaker, error handling)
```

=> Luồng này giúp hệ thống:

```bash
scale tốt
không block request
dễ mở rộng event-driven sau này
```

# Luồng 4: Luồng health & observability

Luồng này dành cho Kubernetes / monitoring.

```bash
health.routes.ts → readiness.ts
```

Nó kiểm tra:

```bash
app có chạy không
DB, Redis, Kafka còn sống không
metrics plugin ghi nhận trạng thái hệ thống
```

=> Không ảnh hưởng business, nhưng ảnh hưởng sống còn khi deploy production.
