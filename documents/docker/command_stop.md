# 1. Dọn dẹp container cũ

docker compose -f docker-compose.dev.yml down -v

# 2. Xóa volume cũ (nếu có)

docker volume rm bear_kafka_data 2>/dev/null || true

# 3. Chạy lại

docker compose -f docker-compose.dev.yml up
