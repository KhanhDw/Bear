Khi cần thêm dependency cho 1 microservice

❌ KHÔNG:

```bash
cd backend/services/post-service
npm install fastify
```

✅ ĐÚNG:

```bash
npm install fastify -w backend/services/post-service
```

✅ ĐÚNG:

```bash
npm i -D @originjs/vite-plugin-federation -w frontend/shell-app
```

Hoặc nếu package.json của service có name:

```bash
npm install fastify -w @services/post-service
```

command find all folder name node_module:

```bash
find . -name "node_modules" -type d
```

---

# run file: docker composer up

# thêm -d để chạy nền

# thêm logs -f vào để xem logs chạy nền:

# => docker compose -f docker-compose.dev.yml logs -f post-service

# chạy nền và không build lại

# docker compose -f docker-compose.dev.yml --profile api up -d --no-build post-service

# run this file: docker compose -f docker-compose.dev.yml up

# Chạy đúng 1 service theo profile

# docker compose -f docker-compose.dev.yml --profile api up post-service

# Chạy tất cả service thuộc profile api

# docker compose -f docker-compose.dev.yml --profile api up

# Chạy nền

# docker compose -f docker-compose.dev.yml --profile api up -d

# Xem log

# docker compose -f docker-compose.dev.yml logs -f post-service

# run nhiều profile cùng lúc

# docker compose -f docker-compose.dev.yml --profile infra --profile api up -d --no-build

# access postgres to write database: docker exec -it postgres_db psql -U root -d root

# call logs : docker logs -f bear-post-service

# call logs : docker logs -f postgres_db

# call logs : docker logs -f kafka

# test kafka: kcat -b localhost:29092 -L
