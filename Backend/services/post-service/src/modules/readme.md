POST /posts

HTTP
→ post.routes
| → post.controller
| | → post.service
| | | → post.repository (write)
| | | → post.events (emit)

--

Vì sao mẫu này “đúng kiến trúc”

Đổi Fastify → Express: chỉ đổi routes/app

Đổi Mongo → Postgres: chỉ đổi repository

Bỏ Kafka: xoá post.events

Thêm cache invalidate: thêm side-effect trong service

👉 Mỗi thay đổi đụng đúng 1 lớp.
