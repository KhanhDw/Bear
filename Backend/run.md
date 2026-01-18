Step-by-Step Guide to Run and Verify Bear Social Network Backend

  I. Environment Setup

  1. Verify Prerequisites

  Command:

   1 docker -v

  Expected Output:

   1 Docker version 20.x.x, build xxxxxxx

  Command:

   1 docker compose version

  Expected Output:

   1 Docker Compose version v2.x.x

  Command:

   1 node -v

  Expected Output:

   1 v18.x.x or higher

  2. Navigate to Project Directory

  Command:

   1 cd D:\2Project_Pivate\Bear\Backend

  3. Prepare Environment File

  Command:

   1 copy .env.dev .env

  4. Start the System

  Command:

   1 docker compose up -d --build

  Expected Output:

    1 [+] Running 25/25
    2  ✔ Container bear-backend-postgres-gateway-1      Healthy
    3  ✔ Container bear-backend-postgres-auth-1         Healthy
    4  ✔ Container bear-backend-postgres-user-1         Healthy
    5  ✔ Container bear-backend-postgres-post-1         Healthy
    6  ✔ Container bear-backend-postgres-comment-1      Healthy
    7  ✔ Container bear-backend-postgres-vote-1         Healthy
    8  ✔ Container bear-backend-postgres-feed-1         Healthy
    9  ✔ Container bear-backend-postgres-notification-1 Healthy
   10  ✔ Container bear-backend-postgres-messaging-1    Healthy
   11  ✔ Container bear-backend-postgres-media-1        Healthy
   12  ✔ Container bear-backend-postgres-group-1        Healthy
   13  ✔ Container bear-backend-postgres-search-1       Healthy
   14  ✔ Container bear-backend-postgres-analytics-1    Healthy
   15  ✔ Container bear-backend-postgres-moderation-1   Healthy
   16  ✔ Container bear-backend-redis-1                 Healthy
   17  ✔ Container bear-backend-zookeeper-1             Healthy
   18  ✔ Container bear-backend-kafka-1                 Healthy
   19  ✔ Container bear-backend-gateway-1               Healthy
   20  ✔ Container bear-backend-auth-service-1          Healthy
   21  ✔ Container bear-backend-user-service-1          Healthy
   22  ✔ Container bear-backend-post-service-1          Healthy
   23  ✔ Container bear-backend-comment-service-1       Healthy
   24  ✔ Container bear-backend-vote-service-1          Healthy
   25  ✔ Container bear-backend-feed-service-1          Healthy
   26  ✔ Container bear-backend-notification-service-1  Healthy

  5. Verify Containers Are Running

  Command:

   1 docker ps

  Expected Output:

   1 CONTAINER ID   IMAGE                           COMMAND                  CREATED        STATUS                   PORTS
     NAMES
   2 xxx            bear-backend-gateway            "docker-entrypoint.s…"   xx minutes ago Up xx minutes (healthy)
     0.0.0.0:8080->8080/tcp             bear-backend-gateway-1
   3 xxx            bear-backend-auth-service       "docker-entrypoint.s…"   xx minutes ago Up xx minutes (healthy)
     3001/tcp                           bear-backend-auth-service-1
   4 xxx            bear-backend-user-service       "docker-entrypoint.s…"   xx minutes ago Up xx minutes (healthy)  3002/
     tcp                           bear-backend-user-service-1
   5 xxx            bear-backend-post-service       "docker-entrypoint.s…"   xx minutes ago Up xx minutes (healthy)
     3003/tcp                           bear-backend-post-service-1
   6 xxx            bear-backend-kafka              "/etc/confluent/run.s…"  xx minutes ago Up xx minutes (healthy)
     0.0.0.0:9092->9092/tcp             bear-backend-kafka-1
   7 xxx            bear-backend-redis              "docker-entrypoint.s…"   xx minutes ago Up xx minutes (healthy)
     6379/tcp                           bear-backend-redis-1
   8 xxx            postgres:15                     "docker-entrypoint.s…"   xx minutes ago Up xx minutes (healthy)
     5432/tcp                           bear-backend-postgres-post-1
   9 ...

  6. Verify Container Health Status

  Command:

   1 docker inspect --format='{{json .State.Health}}' bear-backend-gateway-1

  Expected Output:

   1 {"Status":"healthy","FailingStreak":0,"Log":[{"Start":"2024-01-18T09:00:00.000000000Z","End":
     "2024-01-18T09:00:30.000000000Z","ExitCode":0,"Output":"{\"status\":\"healthy\",\"timestamp\":\"
     2024-01-18T09:00:30.000Z\"}"}]}

  Command:

   1 docker inspect --format='{{json .State.Health}}' bear-backend-kafka-1

  Expected Output:

   1 {"Status":"healthy","FailingStreak":0,"Log":[{"Start":"2024-01-18T09:00:00.000000000Z","End":
     "2024-01-18T09:00:30.000000000Z","ExitCode":0,"Output":"Valid output from kafka-broker-api-versions command"}]}

  II. Core Runtime Verification

  1. Gateway Verification

  Command:

   1 curl http://localhost:8080/health

  Expected Output:

    1 {
    2   "status": "healthy",
    3   "services": [
    4     {
    5       "name": "auth",
    6       "status": "up",
    7       "target": "http://auth-service:3001"
    8     },
    9     {
   10       "name": "user",
   11       "status": "up",
   12       "target": "http://user-service:3002"
   13     }
   14   ],
   15   "timestamp": "2024-01-18T09:00:00.000Z"
   16 }

  Command:

   1 curl http://localhost:8080/posts

  Expected Output:

   1 {
   2   "error": "Unauthorized"
   3 }

  2. Auth Flow Verification

  Command:

   1 curl -X POST http://localhost:8080/auth/register -H "Content-Type: application/json" -d
     "{\"email\":\"test@example.com\",\"username\":\"testuser\",\"password\":\"TestPass123!\"}"

  Expected Output:

   1 {
   2   "user": {
   3     "userId": "xxx",
   4     "email": "test@example.com",
   5     "username": "testuser"
   6   },
   7   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
   8   "refreshToken": "xxx"
   9 }

  Command:

   1 curl -X POST http://localhost:8080/auth/login -H "Content-Type: application/json" -d
     "{\"email\":\"test@example.com\",\"password\":\"TestPass123!\"}"

  Expected Output:

   1 {
   2   "user": {
   3     "userId": "xxx",
   4     "email": "test@example.com",
   5     "username": "testuser"
   6   },
   7   "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
   8   "refreshToken": "xxx"
   9 }

  Store the access token for subsequent requests:

   1 TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

  3. Post Service Verification

  Command:

   1 curl -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -X POST http://localhost:8080/posts -d
     "{\"content\":\"Hello, this is my first post!\"}"

  Expected Output:

   1 {
   2   "postId": "xxx",
   3   "userId": "xxx",
   4   "content": "Hello, this is my first post!",
   5   "createdAt": "2024-01-18T09:00:00.000Z"
   6 }

  Command:

   1 curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/posts

  Expected Output:

   1 [
   2   {
   3     "postId": "xxx",
   4     "userId": "xxx",
   5     "content": "Hello, this is my first post!",
   6     "createdAt": "2024-01-18T09:00:00.000Z"
   7   }
   8 ]

  4. Kafka Verification

  Command:

   1 docker exec bear-backend-kafka kafka-topics --list --bootstrap-server localhost:9092

  Expected Output:

   1 __consumer_offsets
   2 post.created
   3 user.created
   4 comment.created
   5 vote.created
   6 post.created.dlq
   7 user.created.dlq
   8 comment.created.dlq
   9 vote.created.dlq

  Command:

   1 docker exec bear-backend-kafka kafka-console-consumer --topic post.created --bootstrap-server localhost:9092
     --from-beginning --max-messages 1

  Expected Output:

   1 {"postId":"xxx","userId":"xxx","content":"Hello, this is my first post!","timestamp":"2024-01-18T09:00:00.000Z"}
   2 Processed a total of 1 messages

  5. Outbox Verification

  Command:

   1 docker exec bear-backend-postgres-post-1 psql -U root -d bear_post_service -c "SELECT * FROM outbox_events;"

  Expected Output:

   1  id | aggregate_id | aggregate_type | event_type | payload | occurred_at | processed_at | published_at | retries |
     max_retries | error_message | trace_id
   2 ----+--------------+----------------+------------+---------+-------------+--------------+--------------+---------+---
     ----------+---------------+----------
   3 (0 rows)

  6. Redis Cache Verification

  Command:

   1 docker exec bear-backend-redis redis-cli keys "*"

  Expected Output:

   1 (empty array)

  7. Metrics Verification

  Command:

   1 curl http://localhost:8080/metrics

  Expected Output:

   1 # HELP process_cpu_user_seconds_total Total user CPU time spent in seconds.
   2 # TYPE process_cpu_user_seconds_total counter
   3 process_cpu_user_seconds_total 0.123
   4 # HELP http_request_duration_seconds Duration of HTTP requests in seconds
   5 # TYPE http_request_duration_seconds histogram
   6 http_request_duration_seconds_bucket{le="0.1",method="GET",route="/health",status_code="200",service="gateway"} 1
   7 http_request_duration_seconds_sum{method="GET",route="/health",status_code="200",service="gateway"} 0.001
   8 ...

  8. Logging + Trace Verification

  Command:

   1 docker logs bear-backend-gateway-1 | tail -10

  Expected Output:

   1 {"level":30,"time":1705568400000,"pid":1,"hostname":"xxx","reqId":"xxx","req":{"method":"GET","url":"/health",
     "hostname":"localhost:8080","remoteAddress":"172.x.x.x"},"msg":"incoming request"}
   2 {"level":30,"time":1705568400001,"pid":1,"hostname":"xxx","reqId":"xxx","res":{"statusCode":200},"responseTime":1.234
     ,"msg":"request completed"}

  Command:

   1 docker logs bear-backend-post-service-1 | grep -i trace

  Expected Output:

   1 {"level":30,"time":1705568400000,"pid":1,"hostname":"xxx","traceId":"xxx","userId":"xxx","msg":"Processing post
     creation"}

  9. Rate Limit Test

  Command:

   1 for i in {1..10}; do curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/health; done

  Expected Output:

    1 200
    2 200
    3 200
    4 200
    5 200
    6 200
    7 200
    8 200
    9 200
   10 200

  10. Graceful Shutdown Test

  Command:

   1 docker stop bear-backend-post-service-1

  Expected Output:

   1 bear-backend-post-service-1

  Command:

   1 docker start bear-backend-post-service-1

  Expected Output:

   1 bear-backend-post-service-1

  III. Failure Simulation

  1. Kafka Down Simulation

  Command:

   1 docker stop bear-backend-kafka

  Command:

   1 curl -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -X POST http://localhost:8080/posts -d
     "{\"content\":\"Post during Kafka down\"}"

  Expected Output:

   1 Should eventually succeed once Kafka is back up

  Command:

   1 docker start bear-backend-kafka

  2. Redis Down Simulation

  Command:

   1 docker stop bear-backend-redis

  Command:

   1 curl http://localhost:8080/health

  Expected Output:

   1 Health status should still work, possibly degraded

  Command:

   1 docker start bear-backend-redis

  IV. Debug Playbook

  1. Inspect Logs

  Command:

   1 docker logs bear-backend-gateway-1 --tail 20

  Command:

   1 docker logs bear-backend-post-service-1 --tail 20

  2. Inspect Metrics

  Command:

   1 curl http://localhost:8080/metrics | grep http_requests_total

  3. Inspect Kafka Lag

  Command:

   1 docker exec bear-backend-kafka kafka-consumer-groups --bootstrap-server localhost:9092 --describe --group
     post-service

  4. Inspect Database

  Command:

   1 docker exec bear-backend-postgres-post-1 psql -U root -d bear_post_service -c "SELECT COUNT(*) FROM posts;"

  V. Verification Complete

  Command:

   1 docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

  Expected Output:

   1 NAMES                                STATUS                    PORTS
   2 bear-backend-gateway-1              Up XX minutes (healthy)   0.0.0.0:8080->8080/tcp
   3 bear-backend-auth-service-1         Up XX minutes (healthy)   3001/tcp
   4 bear-backend-user-service-1         Up XX minutes (healthy)   3002/tcp
   5 bear-backend-post-service-1         Up XX minutes (healthy)   3003/tcp
   6 ...

  The system is now running and all core functionality has been verified.
