docker build -t gateway ./gateway
docker build -t user-service ./services/user-service
docker build -t post-service ./services/post-service
docker build -t ranking-consumer ./consumers/ranking-consumer
=> Mỗi lệnh = 1 đơn vị deploy.

# Dùng docker-compose để ghép chúng lại

```bash
services:
  gateway:
    build: ./gateway
    ports:
      - "3000:3000"

  user-service:
    build: ./services/user-service

  post-service:
    build: ./services/post-service

  ranking-consumer:
    build: ./consumers/ranking-consumer

  kafka:
    image: bitnami/kafka

  redis:
    image: redis:7

```
